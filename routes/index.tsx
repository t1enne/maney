import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { supabase } from "../main.ts";
import MainTable from "../components/MainTable.tsx";
import Layout from "../layouts/Layout.tsx";
import { Movement } from "../types/Movement.type.ts";

interface Data {
  movements?: Movement[];
  monthTotal?: number;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const month = new Date().getMonth() + 1;
    const user = req.headers.get("user");
    const { data: movements, error } = await supabase
      .from("movements")
      .select();
    if (!movements || error) {
      return new Response(null, {
        status: 304,
      });
    }
    const monthTotal = movements
      .filter((m) => +m.date.split("-")[1] === month)
      .reduce((acc, mov) => (acc += mov.amount), 0)
      .toFixed(2);
    return ctx.render!({ movements, monthTotal, user });
  },
};

export default ({ data: { movements, monthTotal } }: PageProps<Data>) => {
  return (
    <Layout user="nasir">
      <main class="container">
        <article class="my-0">
          <div class="flex justify-between">
            <hgroup>
              <h4 class="m-0">🔥 Expenses</h4>
              <h6>This month: € {monthTotal}</h6>
            </hgroup>
            <a href="/movement" class="self-center">
              <button class="flex gap-2">
                <strong class="hidden md:inline">Add</strong>
                <strong>+</strong>
              </button>
            </a>
          </div>
          <MainTable movements={movements} />
        </article>
      </main>
    </Layout>
  );
};
