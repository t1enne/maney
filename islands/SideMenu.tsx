import { Styles } from "../consts/Styles.ts";

function handleClick(e: Event) {
  e.preventDefault();
  const t = e.target as HTMLElement;
  let theme = t.getAttribute("data-theme-switcher") as string;
  document.querySelector("details[role='list']")?.removeAttribute("open");
  if (theme == "auto") theme = getDefaultTheme();
  setTheme(theme);
}

function setTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("class", theme);
  window.localStorage.setItem("theme", theme);
}

function getDefaultTheme(): string {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default () => {
  const options = ["auto", "light", "dark"];

  return (
    <details role="list" dir="rtl">
      <summary aria-haspopup="listbox" class="">
        Menu
      </summary>
      <ul role="listbox">
        <li class="text-gray-400 dark:text-gray-700">Theme</li>
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
        <li class="text-gray-400 dark:text-gray-700">Actions</li>
        <li>
          <a class={`text-${Styles.negative}`} href="/api/logout">
            Logout
          </a>
        </li>
      </ul>
    </details>
  );
};
