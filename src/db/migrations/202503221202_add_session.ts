import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (c) => c.primaryKey())
    .addColumn("user_id", "integer", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("secret_hash", "blob", (c) => c.notNull())
    .addColumn("expires_at", "text", (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("session").execute();
}
