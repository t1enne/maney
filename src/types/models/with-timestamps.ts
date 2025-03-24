import { ColumnType } from "kysely";

export type WithTimeStamps = {
  createdAt: ColumnType<Date | string | undefined, never>;
};
