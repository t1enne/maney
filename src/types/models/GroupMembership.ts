import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { WithTimeStamps } from "./with-timestamps";

export type GroupMembershipTable = {
  id: Generated<number>;
  groupId: number;
  userId: number;
  role: "admin" | "member";
} & WithTimeStamps;

export type GroupMembership = Selectable<GroupMembershipTable>;
export type GroupMembershipCreate = Insertable<GroupMembershipTable>;
export type GroupMembershipUpdate = Updateable<GroupMembershipTable>;