import { PropsWithChildren } from "hono/jsx";
import { css, Style } from "hono/css";
import clsx from "clsx";

export function MovementsTable({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Style>
        {css`
          thead tr {
            position: sticky;
            top: 0px;
            background-color: var(--color-base-100);
          }
        `}
      </Style>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className={clsx("w-1/12")}>
              Date
            </th>
            <th scope="col" className={clsx("w-3/12")}>
              Amount
            </th>
            <th scope="col" className={clsx("w-5/12")}>
              Description
            </th>
            <th scope="col" className={clsx("w-1/12")} />
            <th scope="col" className={clsx("w-1/12")} />
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </>
  );
}
