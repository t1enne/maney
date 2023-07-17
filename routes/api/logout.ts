import { Handlers } from "$fresh/server.ts";
import { supabase } from "../../main.ts";

export const handler: Handlers = {
  async GET(_) {
    const res = await supabase.auth.signOut();
    const { error } = res;

    if (error) {
      return new Response(null, {
        status: 404,
      });
    }
    const headers = new Headers();
    headers.set("Location", "/");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
