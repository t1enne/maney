import { FC } from "hono/jsx";
import dayjs from "dayjs";
import { Layout } from "../components/layout";
import { MOVEMENT_CATEGORIES } from "../consts/categories";
import { db } from "../db/kysely";

const getMovement = (id: number) =>
  db
    .selectFrom("movement")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

export const MovementUpsert: FC<{
  id?: number;
  userId?: string;
}> = async (props) => {
  const { id } = props;
  const movement = id ? await getMovement(id) : undefined;
  const today = movement?.date ? dayjs(movement.date) : dayjs();

  const formAttrs = {
    "hx-post": `/movement${id ? `/${id}` : ""}`,
    "hx-target": "#root",
    "hx-select": "#root",
    "hx-replace-url": "true",
  } as const;

  return (
    <Layout>
      <article className="grid relative" x-data>
        <div className="flex justify-between mb-4">
          <hgroup>
            <h4 className="text-2xl font-bold">
              {movement ? "Edit" : "💸 New"}
            </h4>
            <h6>You can {movement ? "edit" : "input"} movement info here</h6>
          </hgroup>
        </div>
        <div className="py-2" />
        <form {...formAttrs}>
          <div className="">
            <div className="flex flex-col gap-2">
              <input
                className="hidden w-full"
                name="userId"
                value={movement?.userId || 1}
              />
              <input
                className="input w-full"
                type="text"
                value={movement?.description}
                placeholder="Note"
                name="description"
                aria-label="Note"
              />
              <input
                className="input w-full"
                type="number"
                name="amount"
                aria-label="amount"
                value={movement?.amount || 0}
                placeholder="0.00"
                step="0.25"
                min="0.25"
                required
              />

              <input
                className="input w-full"
                type="date"
                id="date"
                name="date"
                value={today.format("YYYY-MM-DD")}
                required
              />
              <select className="select capitalize w-full" name="category">
                {Object.entries(MOVEMENT_CATEGORIES).map(([key, value]) => (
                  <option value={value}>{key}</option>
                ))}
              </select>
            </div>
            <div className="py-2" />
            <div className="flex justify-end">
              <button className="btn btn-primary" type="submit">
                {movement ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </form>
      </article>
    </Layout>
  );
};
