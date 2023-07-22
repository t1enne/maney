/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { load } from "$std/dotenv/mod.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { createClient } from "$supabase";

const { SUPA_URL, SUPA_PWD } = await load();

if (SUPA_URL && SUPA_PWD) {
  Deno.env.set("SUPA_URL", SUPA_URL);
  Deno.env.set("SUPA_PWD", SUPA_PWD);
}

const url = Deno.env.get("SUPA_URL") as string;
const pwd = Deno.env.get("SUPA_PWD") as string;

export const toasts = [];
export const supabase = createClient(url, pwd, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

await start(manifest, {
  plugins: [twindPlugin(twindConfig)],
  render: (ctx, render) => {
    ctx.lang = "it";
    render();
  },
  port: 3000,
});
