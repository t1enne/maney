import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { supabase } from "../main.ts";
import MainTable from "../islands/MainTable.tsx";
import Layout from "../layouts/Layout.tsx";
import { Movement } from "../types/Movement.type.ts";
import { getCookies } from "$std/http/cookie.ts";

interface Data {
  movements?: Movement[];
  monthTotal?: number;
  month: number;
  year: number;
}

async function getFilteredMovements(
  userId: string,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
): Promise<Data | null> {
  const yyyyMM = `${year}-${month.toString().padStart(2, "0")}`;
  const lastDayInMonth = new Date(year, month, 0).getDate();
  const { data: movements, error } = await supabase
    .from("movements")
    .select()
    .eq("userId", userId)
    .gte("date", `${yyyyMM}-01`)
    .lte("date", `${yyyyMM}-${lastDayInMonth}`);

  if (error) {
    console.error(error);
    return null;
  }

  const monthTotal = movements
    .reduce((acc, mov) => (acc += mov.amount), 0)
    .toFixed(2);

  return { year, month, movements, monthTotal };
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const { userId } = getCookies(req.headers);
    const props = await getFilteredMovements(userId);
    if (!props) {
      return new Response(null, {
        status: 304,
      });
    }
    return ctx.render(props);
  },
  async POST(req, ctx) {
    const { userId } = getCookies(req.headers);
    const formData = await req.formData();
    const year = formData.get("year") as string;
    const month = formData.get("month") as string;
    const props = await getFilteredMovements(userId, +year, +month + 1);
    if (!props) {
      return new Response(null, {
        status: 304,
      });
    }
    return ctx.render(props);
  },
};

export default ({
  data: { month, year, movements, monthTotal = 0 },
}: PageProps<Data>) => {
  return (
    <Layout>
      <article class="my-0">
        <MainTable
          year={year}
          month={month}
          movements={movements}
          total={monthTotal}
        />
      </article>
    </Layout>
  );
};
