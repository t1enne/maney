import { GroupMembershipTable } from "./models/GroupMembership";
import { GroupTable } from "./models/Group";
import { MovementTable } from "./models/Movement";
import { SessionTable } from "./models/Session";
import { UserTable } from "./models/User";

export type DatabaseSchema = {
  user: UserTable;
  movement: MovementTable;
  session: SessionTable;
  group: GroupTable;
  group_membership: GroupMembershipTable;
};
