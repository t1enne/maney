import { FC } from "hono/jsx";
import { MovementsPage } from "./movements-page";

export const MovementsTable: FC<{ month: number; year: number }> = ({
  year,
  month,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th className="">Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <MovementsPage year={year} month={month} page={1} />
      </tbody>
    </table>
  );
};
