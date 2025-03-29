import { FC } from "hono/jsx";
import { db } from "../db/kysely";
import { padStart } from "es-toolkit/compat";
import { MONTHS } from "../consts/months";
import dayjs from "dayjs";

const getMovements = (q: string, page: number) =>
  db
    .selectFrom("movement")
    .selectAll()
    .where("date", "like", q)
    .orderBy("date", "asc")
    .limit(10)
    .offset(10 * (page - 1))
    .execute();

export const MovementsPage: FC<{
  year: number;
  month: number;
  page: number;
}> = async ({ year, month, page }) => {
  const q = `${year}-${padStart(`${month}`, 2, "0")}-%`;
  const movements = await getMovements(q, page);
  return (
    <>
      {movements?.map((m, i) => {
        const isLast = i === movements.length - 1;
        const nextPage = `/movement/page/${
          page + 1
        }?year=${year}&month=${month}`;

        return (
          <tr
            id={`#movement-${m.id}`}
            hx-get={nextPage}
            hx-swap="afterend"
            hx-trigger={isLast && "intersect once"}
          >
            <td>
              {MONTHS[month - 1]} {dayjs(m.date).get("date")}
            </td>
            <td>€ {m.amount?.toFixed(2)}</td>
            <td className="truncate max-w-[100px]" title={m.description}>
              {m.description}
            </td>
            <td>
              <a
                hx-boost
                hx-swap="innerHTML"
                href={`/movement/${m.id}`}
                role="button"
                className="btn btn-sm"
              >
                <i className="ph ph-pencil-simple" />
              </a>
            </td>
          </tr>
        );
      })}
    </>
  );
};
