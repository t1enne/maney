import { useEffect } from "preact/hooks";

function handleClick(e: Event) {
  e.preventDefault();
  const t = e.target as HTMLElement;
  const theme = t.getAttribute("data-theme-switcher") as string;
  document.querySelector("details[role='list']")?.removeAttribute("open");
  if (theme == "auto") {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.removeItem("theme");
  } else {
    setTheme(theme);
  }
}
function setTheme(theme: string) {
  window.localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export default () => {
  const options = ["auto", "light", "dark"];

  useEffect(() => {
    const preferredTheme = window.localStorage.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    console.warn(window.localStorage.theme, preferredTheme);

    setTheme(preferredTheme);
  }, []);

  return (
    <details role="list" dir="rtl">
      <summary aria-haspopup="listbox" role="link" class="secondary">
        Theme
      </summary>
      <ul role="listbox">
        {options.map((theme) => (
          <li>
            <a
              onClick={handleClick}
              href="#"
              data-theme-switcher={theme}
              class="capitalize"
            >
              {theme}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};
