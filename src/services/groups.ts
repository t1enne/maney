import { db } from "../db/kysely";
import { Group, GroupCreate, GroupUpdate } from "../types/models/Group";
import { GroupMembership } from "../types/models/GroupMembership";

export const GroupsService = {
  async createGroup(groupData: GroupCreate): Promise<Group> {
    const [group] = await db
      .insertInto("group")
      .values(groupData)
      .returning([
        "id",
        "name",
        "description",
        "createdBy",
        "createdAt",
      ])
      .execute();

    if (!group) {
      throw new Error("Failed to create group");
    }

    await db
      .insertInto("group_membership")
      .values({
        groupId: group.id,
        userId: groupData.createdBy,
        role: "admin",
      })
      .execute();

    return group;
  },

  async getUserGroups(userId: number): Promise<Group[]> {
    return await db
      .selectFrom("group")
      .innerJoin("group_membership", "group.id", "group_membership.groupId")
      .select([
        "group.id",
        "group.name",
        "group.description",
        "group.createdBy",
        "group.createdAt",
      ])
      .where("group_membership.userId", "=", userId)
      .execute();
  },

  async getGroupById(groupId: number): Promise<Group | undefined> {
    return await db
      .selectFrom("group")
      .select([
        "id",
        "name",
        "description",
        "createdBy",
        "createdAt",
      ])
      .where("id", "=", groupId)
      .executeTakeFirst();
  },

  async getGroupMembers(groupId: number) {
    return await db
      .selectFrom("group_membership")
      .innerJoin("user", "group_membership.userId", "user.id")
      .select([
        "user.id",
        "user.mail",
        "group_membership.role",
        "group_membership.createdAt",
      ])
      .where("group_membership.groupId", "=", groupId)
      .execute();
  },

  async addMember(groupId: number, userId: number, role: "admin" | "member" = "member"): Promise<GroupMembership> {
    const [membership] = await db
      .insertInto("group_membership")
      .values({
        groupId,
        userId,
        role,
      })
      .returning([
        "id",
        "groupId",
        "userId",
        "role",
        "createdAt",
      ])
      .execute();

    if (!membership) {
      throw new Error("Failed to add member");
    }

    return membership;
  },

  async removeMember(groupId: number, userId: number): Promise<void> {
    await db
      .deleteFrom("group_membership")
      .where("groupId", "=", groupId)
      .where("userId", "=", userId)
      .execute();
  },

  async updateGroup(groupId: number, updates: GroupUpdate): Promise<Group | undefined> {
    const [group] = await db
      .updateTable("group")
      .set(updates)
      .where("id", "=", groupId)
      .returning([
        "id",
        "name",
        "description",
        "createdBy",
        "createdAt",
      ])
      .execute();

    return group;
  },

  async deleteGroup(groupId: number): Promise<void> {
    await db.deleteFrom("group").where("id", "=", groupId).execute();
  },

  async isUserInGroup(userId: number, groupId: number): Promise<boolean> {
    const membership = await db
      .selectFrom("group_membership")
      .select("id")
      .where("userId", "=", userId)
      .where("groupId", "=", groupId)
      .executeTakeFirst();

    return !!membership;
  },

  async getUserRole(userId: number, groupId: number): Promise<"admin" | "member" | null> {
    const membership = await db
      .selectFrom("group_membership")
      .select("role")
      .where("userId", "=", userId)
      .where("groupId", "=", groupId)
      .executeTakeFirst();

    return membership?.role || null;
  },

  async getUserGroupIds(userId: number): Promise<number[]> {
    const memberships = await db
      .selectFrom("group_membership")
      .select("groupId")
      .where("userId", "=", userId)
      .execute();

    return memberships.map(m => m.groupId);
  },
};