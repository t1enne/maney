import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { WithTimeStamps } from "./with-timestamps";

export type UserTable = {
  id: Generated<number>;
  mail: string;
  passwordHash: string;
} & WithTimeStamps;

export type User = Selectable<UserTable>;
export type UserCreate = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
