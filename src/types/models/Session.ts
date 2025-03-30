import { Insertable, Selectable, Updateable } from "kysely";
import { ColumnType } from "kysely";

export type SessionTable = {
  id: string;
  userId: string;
  expiresAt: ColumnType<Date, Date, Date | undefined>;
};

export type Session = Selectable<SessionTable>;
export type SessionCreate = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
