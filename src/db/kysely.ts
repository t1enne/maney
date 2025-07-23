import { Kysely, CamelCasePlugin, CompiledQuery } from "kysely";
import { DatabaseSchema } from "../types/database";
import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";

const DEVELOPMENT = process.env.NODE_ENV !== "production";
const dbUrl = DEVELOPMENT ? "./db.sqlite3" : "/data/db.sqlite3";
console.log("dburl", dbUrl);
const _db = new Database(dbUrl);
export const db = new Kysely<DatabaseSchema>({
  dialect: new BunSqliteDialect({
    database: _db,
    onCreateConnection: async (c) => {
      await c.executeQuery(CompiledQuery.raw("PRAGMA journal_mode=WAL"));
    },
  }),
  plugins: [new CamelCasePlugin()],
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, closing database...");
  _db.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, closing database...");
  _db.close();
  process.exit(0);
});
