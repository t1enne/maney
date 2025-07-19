import type {
  Session,
  SessionCreate,
  SessionWithToken,
} from "../types/models/Session";
import { db } from "../db/kysely";
import { isNullable } from "../utils/index";
import dayjs from "dayjs";
import { User } from "../types/models/User";
import { sign } from "hono/jwt";
import { invariant } from "es-toolkit";

const JWT_SECRET = process.env.JWT_SECRET!;
invariant(JWT_SECRET, "need to set .env");

export const SessionService = {
  generateSecureRandomString(): string {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijklmnpqrstuvwxyz23456789";
    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
      // >> 3 s"removes" the right-most 3 bits of the byte
      id += alphabet[bytes[i]! >> 3];
    }
    return id;
  },
  async hashSecret(secret: string): Promise<Buffer> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return Buffer.from(secretHashBuffer);
  },
  async createSession(userId: number): Promise<SessionWithToken> {
    const id = this.generateSecureRandomString();
    const expiresAt = dayjs().add(25, "minutes").toISOString();
    const plainSecret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(plainSecret);
    const token = `${id}.${plainSecret}`;
    const session: SessionCreate = {
      id,
      secretHash,
      userId,
      expiresAt,
    };
    const created = await db
      .insertInto("session")
      .values(session)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { ...created, token };
  },
  // keep it for later
  async validateSessionToken(token: string) {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 2) {
      return null;
    }
    const [sessionId, sessionSecret] = tokenParts as [string, string];
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }
    const tokenSecretHash = await this.hashSecret(sessionSecret);
    const validSecret = this.constantTimeEqual(
      tokenSecretHash,
      session.secretHash,
    );
    if (!validSecret) {
      return null;
    }

    return session;
  },
  async getSession(sessionId: string): Promise<Session | null> {
    const _row = await db
      .selectFrom("session")
      .selectAll()
      .innerJoin("user", "user.id", "session.userId")
      .where("id", "=", sessionId)
      .executeTakeFirst();

    if (isNullable(_row)) {
      return null;
    }
    const session = _row as Session;
    const expiresAt = new Date(session.expiresAt!);

    if (Date.now() >= expiresAt.getTime()) {
      await db.deleteFrom("session").where("id", "=", session.id).execute();
      return null;
    }

    if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      const expiresAt = dayjs().add(25, "minutes").toISOString();
      const updatedSession = await db
        .updateTable("session")
        .where("id", "=", session.id)
        .set("expiresAt", expiresAt)
        .returningAll()
        .executeTakeFirst();
      return updatedSession ?? null;
    }
    return session;
  },
  async generateJWT(session: SessionWithToken, user: User) {
    const payload = {
      exp: dayjs(session.expiresAt).unix(),
      userId: session.userId,
      mail: user.mail,
    };
    return await sign(payload, JWT_SECRET);
  },
  constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
      // @ts-expect-error
      c |= a[i] ^ b[i];
    }
    return c === 0;
  },
  invalidateSession(sessionId: string) {
    return db.deleteFrom("session").where("id", "=", sessionId).execute();
  },
  async invalidateAllSessions(userId: number): Promise<void> {
    await db.deleteFrom("session").where("userId", "=", userId).execute();
  },
} as const;
