import { Kysely } from "kysely";
import { CamelCasePlugin } from "kysely";
import { DatabaseSchema } from "../types/database";
import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";

export const db = new Kysely<DatabaseSchema>({
  dialect: new BunSqliteDialect({
    database: new Database("db.sqlite3"),
  }),
  plugins: [new CamelCasePlugin()],
});
