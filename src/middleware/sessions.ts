import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { invariant } from "es-toolkit";

const JWT_TOKEN = "jwt";
const JWT_SECRET = process.env.JWT_SECRET!;
invariant(JWT_SECRET, "need to set .env");

export const sessionMiddleware = () => {
  return async (c: Context, next: Function) => {
    if (c.req.path === "/login") {
      return next();
    }
    const jwt = getCookie(c, JWT_TOKEN);
    if (!jwt) {
      return c.redirect("/login");
    }
    const payload = await verify(jwt, JWT_SECRET);
    if (!payload) {
      return c.redirect("/login");
    }
    return next();
  };
};
