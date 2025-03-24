import * as path from "node:path";
import { promises as fs } from "node:fs";
import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./kysely";
import { parseArgs } from "node:util";

const flags = parseArgs({
  options: {
    up: {
      type: "boolean",
    },
    down: {
      type: "boolean",
    },
  },
});

const _db = db;
const migrator = new Migrator({
  db: _db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(process.cwd(), "src/db/migrations"),
  }),
});

migrate(flags);

async function migrate(f: typeof flags) {
  const { error, results } = f.values.up
    ? await migrator.migrateToLatest()
    : await migrator.migrateDown();

  console.log(`Migrating ${f.values.up ? "up" : "down"}`);

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });
  await _db.destroy();
}
