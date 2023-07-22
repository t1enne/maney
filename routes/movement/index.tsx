import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import MovementUpsert from "../../components/MovementUpsert.tsx";
import Layout from "../../layouts/Layout.tsx";

interface Props {
  userId: string;
}
export const handler: Handlers<Props> = {
  GET(req, ctx) {
    const { userId } = getCookies(req.headers);
    return ctx.render({ userId });
  },
};

export default (props: PageProps<Props>) => {
  const userId = props.data.userId;

  return (
    <Layout title="Add movement" user="nasir">
      <MovementUpsert userId={userId} />
    </Layout>
  );
};
