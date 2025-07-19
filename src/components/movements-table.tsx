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
          <th scope="col" className="w-3/12">
            Date
          </th>
          <th scope="col" className="w-3/12">
            Amount
          </th>
          <th scope="col" className="w-5/12">
            Description
          </th>
          <th scope="col" className="w-1/12"></th>
        </tr>
      </thead>
      <tbody>
        <MovementsPage year={year} month={month} page={1} />
      </tbody>
    </table>
  );
};
