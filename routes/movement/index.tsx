import { PageProps } from "$fresh/src/server/types.ts";
import MovementUpsert from "../../components/MovementUpsert.tsx";
import Layout from "../../layouts/Layout.tsx";

export default (_props: PageProps) => {
  // const { id } = props.params;

  return (
    <Layout title="Add movement" user="nasir">
      <MovementUpsert />
    </Layout>
  );
};
