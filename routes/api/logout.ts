import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { supabase } from "../../main.ts";

export const handler: Handlers = {
  async GET(req) {
    const res = await supabase.auth.signOut();
    const { error } = res;

    if (error) {
      return new Response(null, {
        status: 404,
      });
    }
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: "",
      maxAge: 0,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: new URL(req.url).hostname,
      path: "/",
      secure: true,
    });

    setCookie(headers, {
      name: "userId",
      value: "",
      maxAge: 0,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: new URL(req.url).hostname,
      path: "/",
      secure: true,
    });

    headers.set("Location", "/login");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
