import { Hono } from "hono";
import { db } from "../db/kysely";
import { AuthService } from "../services/auth";
import { SignUpPage } from "../pages/signup";
import assert from "node:assert/strict";

const auth = new Hono();
auth.get("/signup", (c) => c.html(<SignUpPage />));

auth.post("/signup", async (c) => {
  const fd = await c.req.formData();
  const mail = fd.get("mail")?.toString();
  const password = fd.get("password")?.toString();
  assert(mail && password, "Mail or pwd missing");

  const hashedPassword = await AuthService.hash(password);
  await db
    .insertInto("user")
    .values({
      mail,
      passwordHash: hashedPassword,
    })
    .executeTakeFirstOrThrow();

  return c.redirect("/");
});
export default auth;
