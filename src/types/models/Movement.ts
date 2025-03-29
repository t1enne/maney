import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { WithTimeStamps } from "./with-timestamps";

export type MovementTable = {
  id: Generated<number>;
  amount: number;
  date: string;
  category: string;
  description: string;
  userId: number;
} & WithTimeStamps;

export type Movement = Selectable<MovementTable>;
export type MovementCreate = Insertable<MovementTable>;
export type MovementUpdate = Updateable<MovementTable>;
