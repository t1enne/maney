import { FC } from "hono/jsx";
import { Movement } from "../types/models/Movement";
import { MONTHS } from "../consts/months";
import { Layout } from "../components/layout";

export const HomePage: FC<{
  movements?: Movement[];
  total: number;
  month: number;
  year: number;
}> = ({ movements, total, month, year }) => {
  const totalCssClass = "";

  return (
    <Layout>
      <div className="max-w-96 m-auto">
        <div className="flex justify-between" hx-boost="true">
          <hgroup>
            <h4 className="m-0">🔥 Expenses</h4>
            <h6>
              This month:
              <span class={`text-${totalCssClass}`}>
                <strong>€ {total}</strong>
              </span>
            </h6>
          </hgroup>
          <a
            role="button"
            href="/movement"
            className="self-center btn btn-primary flex gap-2"
          >
            <strong className="hidden md:inline">Add</strong>
            <strong>+</strong>
          </a>
        </div>
        <form id="date-picker" method="post">
          <fieldset className="flex items-center gap-2 mb-0 justify-between mt-8">
            <button
              className="btn btn-outline w-auto"
              role="button"
              data-date={`${month == 0 ? year - 1 : year}-${
                month == 0 ? 11 : month - 2
              }`}
              //onClick={selectAndSubmit}
            >
              ⬅
            </button>
            <div className="flex w-48 gap-1">
              <input
                className="input"
                name="year"
                type="number"
                max={new Date().getFullYear()}
                value={year || new Date().getFullYear()}
              />
              <select name="month" className="select w-24">
                {MONTHS.map((m, i) => (
                  <option selected={i == month - 1} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-outline w-auto"
              role="button"
              data-date={`${month == 11 ? year + 1 : year}-${
                month == 11 ? 0 : month
              }`}
            >
              ➡
            </button>
          </fieldset>
        </form>
        <div>
          {movements?.map((m) => {
            return (
              <div className="flex justify-between mt-4">
                <div>
                  <h6 class={`mb-0`}>€ {m.amount?.toFixed(2)}</h6>
                  <p className="text-sm text-gray-500">
                    {m.description ? m.description : "-"}
                  </p>
                </div>
                <div className="flex">
                  <div>
                    <small className="capitalize font-bold text-gray-600">
                      {MONTHS[+month - 1]} day?
                    </small>
                  </div>
                  <div className="ml-4">
                    <a
                      href={`/movement/${m.id}`}
                      role="button"
                      className="outline outline"
                    >
                      ✏
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
