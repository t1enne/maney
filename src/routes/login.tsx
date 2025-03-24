import { Hono } from "hono";
import { LoginPage } from "../pages/login";
import assert from "node:assert/strict";
import { AuthService } from "../services/auth";
import { db } from "../db/kysely";

const login = new Hono();

login.get("/", (c) => c.html(<LoginPage />));
login.post("/", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  assert(mail && password, "Mail or pwd missing");

  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("mail", "=", mail)
    .executeTakeFirst();

  if (!(user && (await AuthService.verify(user.passwordHash, password)))) {
    c.status(500);
    return c.html(<LoginPage withErrors={true} />);
  }

  return c.redirect("/");
});

export default login;
