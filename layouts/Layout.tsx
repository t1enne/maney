import { Head } from "$fresh/src/runtime/head.ts";
import { VNode } from "preact";
import Nav from "../components/Nav.tsx";
import { Toaster } from "../utils/Toaster.ts";
import ToastsWrap from "../islands/ToastsWrap.tsx";

interface Props {
  user?: string;
  children: VNode;
  title?: string;
}

export default (props: Props) => {
  return (
    <>
      <Head>
        <title>{props.title || "Home finances"}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <Nav user={props.user} />
      <main class="container">{props.children}</main>
      <ToastsWrap toasts={Toaster.toasts} />
    </>
  );
};
