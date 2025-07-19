import { Hono } from "hono";
import { db } from "../db/kysely";
import { AuthService } from "../services/auth";
import { SignUpPage } from "../pages/signup";
import assert from "node:assert/strict";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { decode } from "hono/jwt";
import { JwtPayload } from "../types/models/jwt-payload";
import { SessionService } from "../services/session";

const auth = new Hono();
auth.get("/signup", (c) => c.html(<SignUpPage />));

auth.post("/signup", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  assert(mail && password, "Mail or pwd missing");

  const passwordHash = await AuthService.hash(password);
  const user = await db
    .insertInto("user")
    .values({ mail, passwordHash })
    .returningAll()
    .executeTakeFirstOrThrow();

  const session = await SessionService.createSession(user.id);
  const jwt = await SessionService.generateJWT(session, user);
  setCookie(c, "jwt", jwt);

  return c.redirect("/");
});

auth.get("/logout", async (c) => {
  const cookie = getCookie(c, "jwt");
  if (cookie) {
    deleteCookie(c, "jwt");
    const { payload } = decode(cookie);
    const jwtPaylod = JwtPayload.parse(payload);
    await db
      .deleteFrom("session")
      .where("userId", "=", jwtPaylod.userId)
      .execute();
  }
  return c.redirect("/login");
});

export default auth;
