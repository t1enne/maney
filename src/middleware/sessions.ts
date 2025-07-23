import { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { invariant } from "es-toolkit";

const JWT_TOKEN = "jwt";
const JWT_SECRET = process.env.JWT_SECRET!;
invariant(JWT_SECRET, "need to set .env");

const PUBLIC_PATHS = ["/login", "/auth/signup", "/sse", "/notifications"];

export const sessionMiddleware = () => {
  return async (c: Context, next: Function) => {
    const needsAuth = !PUBLIC_PATHS.includes(c.req.path);
    if (!needsAuth) {
      return next();
    }
    const jwt = getCookie(c, JWT_TOKEN);
    if (!jwt) {
      return c.redirect("/login");
    }
    const payload = await verify(jwt, JWT_SECRET)
      .then((r) => r)
      .catch((_) => {
        deleteCookie(c, "jwt");
        return false;
      });
    if (!payload) {
      return c.redirect("/login");
    }
    return next();
  };
};
