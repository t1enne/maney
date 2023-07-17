import { PageProps } from "$fresh/src/server/types.ts";
import { Handlers } from "$fresh/server.ts";
import MovementUpsert from "../../components/MovementUpsert.tsx";
import Layout from "../../layouts/Layout.tsx";
import { supabase } from "../../main.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const { data: movements, error } = await supabase
      .from("movements")
      .select("*")
      .eq("id", id);

    if (!movements || error) {
      return new Response(null, {
        status: 304,
      });
    }

    return ctx.render(movements[0]);
  },
};

export default ({ data }: PageProps) => {
  return (
    <Layout title="Edit movement" user="nasir">
      <MovementUpsert movement={data} />
    </Layout>
  );
};
