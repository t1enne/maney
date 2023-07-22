import { MONTHS } from "../consts/Months.ts";
import { Styles } from "../consts/Styles.ts";
import { Movement } from "../types/Movement.type.ts";

interface Props {
  movements?: Movement[];
}

export default ({ movements }: Props) => {
  return (
    <>
      <div class="flex justify-between mt-8">
        <button class="w-auto secondary" role="button">
          🡨
        </button>
        <span></span>
        <button class="w-auto secondary" role="button">
          🡪
        </button>
      </div>
      <div>
        {movements?.map((m) => {
          const [_, month, day] = m.date.split("-");
          const amountClass = m.amount > 0
            ? `text-${Styles.positive}`
            : `text-${Styles.negative}`;
          return (
            <div class="flex justify-between mt-4 border-b-1 border-gray-800">
              <hgroup>
                <h6 class={amountClass}>€ {m.amount.toFixed(2)}</h6>
                <span class="text-gray-500">{m.note ? m.note : "-"}</span>
              </hgroup>
              <div class="flex">
                <div>
                  <small class="capitalize font-bold text-gray-600">
                    {MONTHS[+month]} {day}
                  </small>
                  <p class="text-gray-500">{m.user ? m.user : "-"}</p>
                </div>
                <div class="ml-4">
                  <a href={`/movement/${m.id}`} role="button" class="secondary">
                    ✎
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
