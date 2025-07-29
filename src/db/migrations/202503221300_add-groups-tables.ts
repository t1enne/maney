import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("group")
    .addColumn("id", "integer", (c) => c.autoIncrement().primaryKey())
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("description", "text")
    .addColumn("created_by", "integer", (c) =>
      c.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "text", (c) => c.notNull().defaultTo("CURRENT_TIMESTAMP"))
    .execute();

  await db.schema
    .createTable("group_membership")
    .addColumn("id", "integer", (c) => c.autoIncrement().primaryKey())
    .addColumn("group_id", "integer", (c) =>
      c.references("group.id").onDelete("cascade").notNull(),
    )
    .addColumn("user_id", "integer", (c) =>
      c.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("role", "text", (c) => c.notNull().defaultTo("member"))
    .addColumn("created_at", "text", (c) => c.notNull().defaultTo("CURRENT_TIMESTAMP"))
    .execute();

  await db.schema
    .createIndex("idx_group_membership_group_user")
    .on("group_membership")
    .columns(["group_id", "user_id"])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("group_membership").execute();
  await db.schema.dropTable("group").execute();
}