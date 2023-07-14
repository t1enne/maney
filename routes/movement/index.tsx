import { PageProps } from "$fresh/src/server/types.ts";
import MovementUpsert from "../../components/MovementUpsert.tsx";
import Layout from "../../layouts/Layout.tsx";

export default (_props: PageProps) => {
  // const { id } = props.params;

  return (
    <Layout>
      <main class="container">
        <MovementUpsert movement={undefined} />
      </main>
    </Layout>
  );
};
