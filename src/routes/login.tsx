import { Hono } from "hono";
import { LoginPage } from "../pages/login";
import { invariant } from "es-toolkit";
import { db } from "../db/kysely";
import { NotificationService } from "../services/notifications";
import { SessionService } from "../services/session";
import { AuthService } from "../services/auth";
import { setCookie } from "hono/cookie";

const login = new Hono();

login.get("/", (c) => c.html(<LoginPage />));
login.post("/", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  invariant(mail && password, "Mail or pwd missing");

  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("mail", "=", mail)
    .executeTakeFirst();

  if (!user) {
    c.status(400);
    NotificationService.notify({
      type: "error",
      title: "No such user",
    });
    return c.body("No such user");
  }
  const isAuth = await AuthService.verify(user.passwordHash, password);
  if (!isAuth) {
    c.status(422);
    NotificationService.notify({
      type: "error",
      title: "Email or password are not correct",
    });
    return c.body("Email or password are not correct");
  }

  const session = await SessionService.createSession(user.id);
  const jwt = await SessionService.generateJWT(session, user);
  setCookie(c, "jwt", jwt);

  return c.redirect("/");
});

export default login;
