import { MONTHS } from "../consts/Months.ts";
import { Movement } from "../types/Movement.type.ts";

interface Props {
  movements?: Movement[];
}

export default ({ movements }: Props) => {
  return (
    <div class="mt-12">
      {
        /* <details open>
    <summary>10/12/2022</summary>
    <div class="flex justify-between">
    <p>Categoria: bar</p>
    <p aria-label="currency">22.00</p>
    </div>
    </details> */
      }
      {movements?.map((m) => {
        const [_, month, day] = m.date.split("-");
        return (
          <div class="flex justify-between mt-4 border-b-1 border-gray-800">
            <hgroup>
              <h6>€ {(m.amount * -1).toFixed(2)}</h6>
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
  );
};
