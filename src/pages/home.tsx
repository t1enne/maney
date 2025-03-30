import { FC } from "hono/jsx";
import { MONTHS } from "../consts/months";
import { Layout } from "../components/layout";
import { MovementsTable } from "../components/movements-table";
import { db } from "../db/kysely";
import { padStart } from "es-toolkit/compat";

export const HomePage: FC<{
  month: number;
  year: number;
}> = async ({ month, year }) => {
  const q = `${year}-${padStart(`${month}`, 2, "0")}-%`;
  const total = await db
    .selectFrom("movement")
    .select((eb) => [eb.fn.sum("amount").as("totalAmount")])
    .where("date", "like", q)
    .execute();

  const getBackUrl = () =>
    month === 0
      ? `/?year=${year - 1}&month=${11}`
      : `/?year=${year}&month=${month - 1}`;

  const getNextUrl = () =>
    month === 11
      ? `/?year=${year + 1}&month=${0}`
      : `/?year=${year}&month=${month + 1}`;

  return (
    <Layout>
      <div className="max-w-96 m-auto">
        <div className="flex justify-between" hx-boost="true">
          <hgroup>
            <h4 className="m-0">🔥 Expenses</h4>
            <h6>
              This month:
              <span class={`text-`}>
                <strong>€ {total.at(0)?.totalAmount || 0}</strong>
              </span>
            </h6>
          </hgroup>
          <a
            role="button"
            href="/movement/crea"
            className="self-center btn btn-primary flex gap-2"
          >
            <strong className="hidden md:inline">Add</strong>
            <strong>+</strong>
          </a>
        </div>
        <fieldset
          hx-boost
          className="flex items-center gap-2 mb-0 justify-between mt-8"
        >
          <a className="btn btn-md w-auto" role="button" href={getBackUrl()}>
            <i className="ph ph-caret-left" />
          </a>
          <div className="grid grid-cols-3 gap-1">
            <input
              className="input col-span-1"
              name="year"
              type="number"
              max={new Date().getFullYear()}
              value={year || new Date().getFullYear()}
            />
            <select className="select col-span-2" name="month">
              {MONTHS.map((m, i) => (
                <option selected={i == month} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <a className="btn btn-md w-auto" role="button" href={getNextUrl()}>
            <i className="ph ph-caret-right" />
          </a>
        </fieldset>
        <div className="py-2" />
        <div className="overflow-auto">
          <MovementsTable year={year} month={month} />
        </div>
      </div>
    </Layout>
  );
};
