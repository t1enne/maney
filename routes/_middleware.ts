import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext<{}>) {
  const accessToken = getCookies(req.headers).auth;
  if (!accessToken && !req.url.endsWith("/login")) {
    return new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  return await ctx.next();
}
