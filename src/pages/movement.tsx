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
    "hx-swap": "outerHTML",
    "hx-replace-url": "true",
  } as const;

  return (
    <Layout>
      <article class="grid relative" x-data>
        <div>
          <div class="flex justify-between mb-4">
            <hgroup>
              <h4>{movement ? "✎ Edit" : "💸 New"}</h4>
              <h6>You can {movement ? "edit" : "input"} movement info here</h6>
            </hgroup>
          </div>
          <form {...formAttrs}>
            <div className="max-w-96 m-auto">
              <div className="flex flex-col gap-2">
                <input
                  className="hidden"
                  name="userId"
                  value={movement?.userId || 1}
                />
                <input
                  className="input"
                  type="text"
                  value={movement?.description}
                  placeholder="Note"
                  name="description"
                  aria-label="Note"
                />
                <input
                  className="input"
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
                  className="input"
                  type="date"
                  id="date"
                  name="date"
                  value={today.format("YYYY-MM-DD")}
                  required
                />
                <select className="select capitalize" name="category">
                  {Object.entries(MOVEMENT_CATEGORIES).map(([key, value]) => (
                    <option value={value}>{key}</option>
                  ))}
                </select>
              </div>
              <div className="py-2" />
              <div className="flex justify-center">
                <button className="btn btn-primary" type="submit">
                  {movement ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </Layout>
  );
};
