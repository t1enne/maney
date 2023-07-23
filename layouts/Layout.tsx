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
    <html data-theme="auto">
      <Head>
        <title>{props.title || "Home finances"}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
const preferredTheme = window.localStorage.theme ||
(window.matchMedia("(prefers-color-scheme: dark)").matches
 ? "dark"
 : "light");
document.documentElement.setAttribute('data-theme', preferredTheme);
document.body.setAttribute('class', preferredTheme);
window.localStorage.setItem("theme", preferredTheme);
  `,
        }}
      />
      <Nav />
      <main class="container">{props.children}</main>
      <ToastsWrap toasts={Toaster.toasts} />
    </html>
  );
};
