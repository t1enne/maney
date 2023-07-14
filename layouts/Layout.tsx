import { Head } from "$fresh/src/runtime/head.ts";
import { VNode } from "preact";
import Nav from "../components/Nav.tsx";

export default (props: { user?: string; children: VNode }) => (
  <>
    <Head>
      <title>Our home finances</title>
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
      />
    </Head>
    <Nav user={props.user} />
    {props.children}
  </>
);
