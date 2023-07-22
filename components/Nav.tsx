import ThemeSwitcher from "../islands/ThemeSwitcher.tsx";

export default ({ user }: { user?: string }) => {
  return (
    <nav class="container">
      <ul class="flex justify-between w-full">
        <li>
          <a href="/" class="flex items-center gap-2">
            <strong>🏠 Home</strong>
          </a>
        </li>
      </ul>
      <ul>
        {
          /*
           <li>
            <details role="list" dir="rtl">
              <summary aria-haspopup="listbox" role="link" class="secondary">
                {user}
              </summary>
              <ul role="listbox">
                <li>
                  <a href="/api/logout">Logout</a>
                </li>
              </ul>
            </details>
          </li>
          */
        }
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  );
};
