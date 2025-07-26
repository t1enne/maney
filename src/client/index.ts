import type { Alpine as IAlpine } from "alpinejs";

declare global {
  interface Window {
    Alpine: IAlpine;
  }
}

document.addEventListener("alpine:init", () => {
  const { Alpine } = window;
  Alpine.data("sample", () => ({
    init() {},
    hello() {
      console.warn("hello from alpine");
    },
  }));
});
