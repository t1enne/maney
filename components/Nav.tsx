import SideMenu from "../islands/SideMenu.tsx";

export default () => {
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
        <li>
          <SideMenu />
        </li>
      </ul>
    </nav>
  );
};
