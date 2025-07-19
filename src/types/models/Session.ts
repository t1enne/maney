import { Insertable, Selectable, Updateable } from "kysely";
import { ColumnType } from "kysely";

export type SessionTable = {
  id: string;
  secretHash: Uint8Array;
  userId: number;
  expiresAt: ColumnType<string | string | string | undefined>;
};

export type Session = Selectable<SessionTable>;
export type SessionCreate = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export interface SessionWithToken extends Session {
  token: string;
}
