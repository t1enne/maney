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
          <th scope="col" className="w-1/4">
            Date
          </th>
          <th scope="col" className="w-1/4">
            Amount
          </th>
          <th scope="col" className="w-1/4">
            Description
          </th>
          <th scope="col" className="w-1/4"></th>
        </tr>
      </thead>
      <tbody>
        <MovementsPage year={year} month={month} page={1} />
      </tbody>
    </table>
  );
};
