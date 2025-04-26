import { Kysely, CamelCasePlugin, CompiledQuery } from "kysely";
import { DatabaseSchema } from "../types/database";
import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";

export const db = new Kysely<DatabaseSchema>({
  dialect: new BunSqliteDialect({
    database: new Database("db.sqlite3"),
    onCreateConnection: async (c) => {
      await c.executeQuery(CompiledQuery.raw("PRAGMA journal_mode=WAL"));
    },
  }),
  plugins: [new CamelCasePlugin()],
});
