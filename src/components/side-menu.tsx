export const SideMenu = () => {
  const options = ["auto", "light", "dark"];

  return (
    <details class="z-10">
      <summary>Theme</summary>
      <ul className="bg-base-100 rounded-t-none p-2">
        {options.map((color) => (
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
              aria-label={color}
              value={color}
            />
          </li>
        ))}
      </ul>
    </details>
  );
};
