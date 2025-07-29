process.env.DB_URL = "test.sqlite3";
import { describe, it, expect, beforeEach } from "bun:test";
import { GroupsService } from "../src/services/groups";
import { db } from "../src/db/kysely";

describe("Groups Service", () => {
  beforeEach(async () => {
    await db.deleteFrom("group_membership").execute();
    await db.deleteFrom("group").execute();
    await db.deleteFrom("user").execute();
  });

  it("should create a group and add creator as admin", async () => {
    const [user] = await db
      .insertInto("user")
      .values({
        mail: "test@example.com",
        passwordHash: "hash123",
      })
      .returning("id")
      .execute();

    expect(user).toBeDefined();

    const group = await GroupsService.createGroup({
      name: "Test Group",
      description: "A test group",
      createdBy: user!.id,
    });

    expect(group.name).toBe("Test Group");
    expect(group.description).toBe("A test group");
    expect(group.createdBy).toBe(user!.id);

    const role = await GroupsService.getUserRole(user!.id, group.id);
    expect(role).toBe("admin");

    const isMember = await GroupsService.isUserInGroup(user!.id, group.id);
    expect(isMember).toBe(true);
  });

  it("should add and remove members", async () => {
    const [user1] = await db
      .insertInto("user")
      .values({
        mail: "admin@example.com",
        passwordHash: "hash123",
      })
      .returning("id")
      .execute();

    const [user2] = await db
      .insertInto("user")
      .values({
        mail: "member@example.com",
        passwordHash: "hash123",
      })
      .returning("id")
      .execute();

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();

    const group = await GroupsService.createGroup({
      name: "Test Group",
      createdBy: user1!.id,
    });

    await GroupsService.addMember(group.id, user2!.id, "member");

    const isMember = await GroupsService.isUserInGroup(user2!.id, group.id);
    expect(isMember).toBe(true);

    const role = await GroupsService.getUserRole(user2!.id, group.id);
    expect(role).toBe("member");

    await GroupsService.removeMember(group.id, user2!.id);

    const isStillMember = await GroupsService.isUserInGroup(
      user2!.id,
      group.id,
    );
    expect(isStillMember).toBe(false);
  });

  it("should get user groups", async () => {
    const [user] = await db
      .insertInto("user")
      .values({
        mail: "test@example.com",
        passwordHash: "hash123",
      })
      .returning("id")
      .execute();

    expect(user).toBeDefined();

    await GroupsService.createGroup({
      name: "Group 1",
      createdBy: user!.id,
    });

    await GroupsService.createGroup({
      name: "Group 2",
      createdBy: user!.id,
    });

    const userGroups = await GroupsService.getUserGroups(user!.id);
    expect(userGroups).toHaveLength(2);
    expect(userGroups.map((g) => g.name)).toContain("Group 1");
    expect(userGroups.map((g) => g.name)).toContain("Group 2");
  });
});

