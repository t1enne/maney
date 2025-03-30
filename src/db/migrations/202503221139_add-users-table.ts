import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (c) => c.autoIncrement().primaryKey())
    .addColumn("mail", "text", (c) => c.notNull().unique())
    .addColumn("password_hash", "text", (c) => c.notNull())
    .execute();

  await db.schema
    .createTable("movement")
    .addColumn("id", "integer", (c) => c.autoIncrement().primaryKey())
    .addColumn("amount", "real", (c) => c.notNull())
    .addColumn("date", "text", (c) => c.notNull())
    .addColumn("description", "text")
    .addColumn("category", "text")
    .addColumn(
      "user_id",
      "text",
      (c) => c.references("user.id").onDelete("set null").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("movement").execute();
}
