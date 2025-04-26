import { Hono } from "hono";
import { LoginPage } from "../pages/login";
import assert from "node:assert/strict";
import { AuthService } from "../services/auth";
import { db } from "../db/kysely";
import { NotificationService } from "../services/notifications";

const login = new Hono();

login.get("/", (c) => c.html(<LoginPage />));
login.post("/", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  console.log({ mail, password });
  assert(mail && password, "Mail or pwd missing");

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

  if (!(user && (await AuthService.verify(user.passwordHash, password)))) {
    c.status(422);
    NotificationService.notify({
      type: "error",
      title: "Email or password are not correct",
    });
    return c.body("Email or password are not correct");
  }

  return c.redirect("/");
});

export default login;
