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
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const { SUPA_URL, SUPA_PWD } = await load();
export const supabase = createClient(SUPA_URL, SUPA_PWD, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
