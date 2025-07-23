import { Hono } from "hono";
import { db } from "../db/kysely";
import { AuthService } from "../services/auth";
import { SignUpPage } from "../pages/signup";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { decode } from "hono/jwt";
import { JwtPayload } from "../types/models/jwt-payload";
import { SessionService } from "../services/session";
import { invariant } from "es-toolkit";
import { NotificationService } from "../services/notifications";
import { HTTPException } from "hono/http-exception";

const auth = new Hono();
auth.get("/signup", (c) => c.render(<SignUpPage />));

auth.post("/signup", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  invariant(mail && password, "Mail or pwd missing");

  const alreadyExists = await db
    .selectFrom("user")
    .select("id")
    .where("user.mail", "=", mail)
    .executeTakeFirst();

  console.log({ alreadyExists });
  if (alreadyExists) {
    NotificationService.notify({ type: "error", title: "User already exists" });
    throw new HTTPException(422, { message: "User already exists" });
  }

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
    const { payload } = decode(cookie);
    const jwtPaylod = JwtPayload.parse(payload);
    deleteCookie(c, "jwt");
    await db
      .deleteFrom("session")
      .where("userId", "=", jwtPaylod.userId)
      .execute();
  }
  return c.redirect("/login");
});

export default auth;
