import { FC } from "hono/jsx";
import { db } from "../db/kysely";
import { padStart } from "es-toolkit/compat";
import { MONTHS } from "../consts/months";
import dayjs from "dayjs";

const getMovements = (userId: number, q: string, page: number) =>
  db
    .selectFrom("movement")
    .selectAll()
    .where("date", "like", q)
    .where("userId", "=", userId)
    .orderBy("date", "asc")
    .limit(10)
    .offset(10 * (page - 1))
    .execute();

export const MovementsRows: FC<{
  userId: number;
  year: number;
  month: number;
  page: number;
}> = async ({ userId, year, month, page }) => {
  const q = `${year}-${padStart(`${month + 1}`, 2, "0")}-%`;
  const movements = await getMovements(userId, q, page);
  return (
    <>
      {movements?.map((m, i) => {
        const isLast = i === movements.length - 1;
        const nextPage = `/movement/page/${
          page + 1
        }?year=${year}&month=${month}`;

        return (
          <tr
            id={`movement-${m.id}`}
            hx-get={nextPage}
            hx-swap="afterend"
            hx-trigger={isLast && "intersect once"}
          >
            <td className="text-nowrap">
              {MONTHS[month - 1]} {dayjs(m.date).get("date")}
            </td>
            <td>€ {m.amount?.toFixed(2)}</td>
            <td className="truncate" title={m.description}>
              <i>{m.description}</i>
            </td>
            <td className="p-1">
              <a
                hx-boost
                hx-swap="innerHTML"
                href={`/movement/${m.id}`}
                role="button"
                className="btn btn-sm btn-soft btn-primary"
              >
                <i className="ph ph-pencil-simple" />
              </a>
            </td>
            <td className="p-1">
              <a
                hx-delete={`/movement/${m.id}/delete`}
                hx-target={`#movement-${m.id}`}
                hx-swap="outerHTML"
                role="button"
                className="btn btn-sm btn-soft btn-error"
              >
                <i className="ph ph-trash-simple" />
              </a>
            </td>
          </tr>
        );
      })}
    </>
  );
};
