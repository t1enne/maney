import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { WithTimeStamps } from "./with-timestamps";

export type GroupTable = {
  id: Generated<number>;
  name: string;
  description: string | null;
  createdBy: number;
} & WithTimeStamps;

export type Group = Selectable<GroupTable>;
export type GroupCreate = Insertable<GroupTable>;
export type GroupUpdate = Updateable<GroupTable>;