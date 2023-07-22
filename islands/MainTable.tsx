import { MONTHS } from "../consts/Months.ts";
import { Styles } from "../consts/Styles.ts";
import { Movement } from "../types/Movement.type.ts";

interface Props {
  movements?: Movement[];
  total: number;
  month: number;
  year: number;
}

function selectAndSubmit(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLButtonElement;
  const [year, month] = target.getAttribute("data-date")!.split("-");

  const yearInput = document.querySelector(
    '#date-picker [name="year"]',
  ) as HTMLInputElement;
  yearInput.value = year;

  const monthInput = document.querySelector(
    '#date-picker [name="month"]',
  ) as HTMLInputElement;
  monthInput.value = month;

  handleChange();
}

function handleChange(_e?: Event) {
  const form = document.querySelector("form#date-picker") as HTMLFormElement;
  form.submit();
}

export default ({ movements, total, month, year }: Props) => {
  const totalCssClass = total > 0 ? Styles.positive : Styles.negative;

  return (
    <>
      <div class="flex justify-between">
        <hgroup>
          <h4 class="m-0">🔥 Expenses</h4>
          <h6>
            This month:{" "}
            <span class={`text-${totalCssClass}`}>
              <strong>€ {total}</strong>
            </span>
          </h6>
        </hgroup>
        <a href="/movement" class="self-center">
          <button class="flex gap-2">
            <strong class="hidden md:inline">Add</strong>
            <strong>+</strong>
          </button>
        </a>
      </div>
      <form id="date-picker" method="post">
        <fieldset class="flex items-center gap-2 mb-0 justify-between mt-8">
          <button
            class="w-auto outline secondary"
            role="button"
            data-date={`${month == 0 ? year - 1 : year}-${
              month == 0 ? 11 : month - 2
            }`}
            onClick={selectAndSubmit}
          >
            ⬅️
          </button>
          <input
            onChange={handleChange}
            name="year"
            type="number"
            min={new Date().getFullYear() - 3}
            max={new Date().getFullYear()}
            value={new Date().getFullYear()}
          />
          <select name="month" class="w-24" onChange={handleChange}>
            {MONTHS.map((m, i) => (
              <option selected={i == month - 1} value={i}>
                {m}
              </option>
            ))}
          </select>
          <button
            class="w-auto outline secondary"
            role="button"
            data-date={`${month == 11 ? year + 1 : year}-${
              month == 11 ? 0 : month
            }`}
            onClick={selectAndSubmit}
          >
            ➡️
          </button>
        </fieldset>
      </form>
      <div>
        {movements?.map((m) => {
          const [_, month, day] = m.date.split("-");
          const amountClass = m.amount > 0
            ? `text-${Styles.positive}`
            : `text-${Styles.negative}`;
          return (
            <div class="flex justify-between mt-4">
              <div>
                <h6 class={`${amountClass} mb-0`}>€ {m.amount.toFixed(2)}</h6>
                <p class="text-sm text-gray-500">{m.note ? m.note : "-"}</p>
              </div>
              <div class="flex">
                <div>
                  <small class="capitalize font-bold text-gray-600">
                    {MONTHS[+month - 1]} {day}
                  </small>
                </div>
                <div class="ml-4">
                  <a
                    href={`/movement/${m.id}`}
                    role="button"
                    class="outline secondary"
                  >
                    ✏️
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
