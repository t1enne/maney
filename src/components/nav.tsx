import { AvatarDropdown } from "./avatar";
import { SideMenu } from "./side-menu";

export const Nav = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a
          hx-boost
          href="/"
          className="btn btn-link text-xl decoration-transparent"
        >
          Maney!
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <SideMenu />
          </li>
          <li>
            <AvatarDropdown />
          </li>
        </ul>
      </div>
    </div>
  );
};
