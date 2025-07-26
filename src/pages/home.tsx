import { FC } from "hono/jsx";
import { MONTHS } from "../consts/months";
import { Layout } from "../components/layout";
import { MovementsTable } from "../components/movements-table";
import { MovementsRows } from "../components/movements-rows";
import { db } from "../db/kysely";
import { padStart } from "es-toolkit/compat";

export const HomePage: FC<{
  userId: number;
  month: number;
  year: number;
}> = async ({ userId, month, year }) => {
  const q = `${year}-${padStart(`${month + 1}`, 2, "0")}-%`;
  const total = await db
    .selectFrom("movement")
    .select((eb) => [eb.fn.sum("amount").as("totalAmount")])
    .where("date", "like", q)
    .where("movement.userId", "=", userId)
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
      <div className="flex gap-2 py-4" hidden={true}>
        <a role="button" hx-get="/test/info" className="btn btn-sm btn-info">
          info
        </a>
        <a
          role="button"
          hx-get="/test/success"
          className="btn btn-sm btn-success"
        >
          success
        </a>
        <a role="button" hx-get="/test/error" className="btn btn-sm btn-error">
          error
        </a>
        <a
          role="button"
          hx-get="/test/warning"
          className="btn btn-sm btn-warning"
        >
          warning
        </a>
      </div>
      <div className="flex justify-between">
        <hgroup>
          <h4 className="m-0 text-2xl font-bold">🔥 Expenses</h4>
          <h6 className="text-lg">
            <i>This month: </i>
            <span>
              <strong id="month-total">
                € {total.at(0)?.totalAmount || 0}
              </strong>
            </span>
          </h6>
        </hgroup>
        <a
          hx-boost
          role="button"
          href="/movement/crea"
          className="self-center btn btn-primary flex gap-2"
        >
          <strong className="hidden md:inline">Add</strong>
          <strong>+</strong>
        </a>
      </div>
      <fieldset className="flex items-center gap-2 mb-0 justify-between mt-8">
        <a
          hx-boost
          className="btn btn-md btn-soft btn-primary w-auto"
          role="button"
          href={getBackUrl()}
        >
          <i className="ph ph-caret-left" />
        </a>
        <div className="grid grid-cols-3 gap-2">
          <input
            x-on:change="console.log($event)"
            className="input col-span-1"
            name="year"
            type="number"
            max={new Date().getFullYear()}
            value={year || new Date().getFullYear()}
          />
          <select
            className="select col-span-2"
            name="month"
            x-on:change="console.log($event.target.value)"
          >
            {MONTHS.map((m, i) => (
              <option selected={i == month} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <a
          hx-boost
          className="btn btn-md btn-soft btn-primary w-auto"
          role="button"
          href={getNextUrl()}
        >
          <i className="ph ph-caret-right" />
        </a>
      </fieldset>
      <div className="py-2" />
      <div className="h-[400px] overflow-auto">
        <MovementsTable>
          <MovementsRows year={year} month={month} page={1} userId={userId} />
        </MovementsTable>
      </div>
    </Layout>
  );
};
