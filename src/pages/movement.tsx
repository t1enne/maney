import { FC } from "hono/jsx";
import { Movement } from "../types/models/Movement";
import dayjs from "dayjs";
import { Layout } from "../components/layout";
import { MOVEMENT_CATEGORIES } from "../consts/categories";

export const MovementUpsert: FC<{
  movement?: Movement;
  userId?: string;
}> = (props) => {
  const { movement } = props;
  const amount = movement?.amount || 0;
  const today = dayjs();

  const formAttrs = {
    method: "post",
    action: "/movement",
    "hx-boost": "true",
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
                  value={movement?.userId || "myid"}
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
                  value={amount > 0 ? Math.abs(amount).toFixed(2) : undefined}
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
                  value={today.format("DD/MM/YY")}
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
