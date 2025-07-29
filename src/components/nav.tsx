import { AvatarDropdown } from "./avatar";
import { SideMenu } from "./side-menu";

export const Nav = () => {
  const id = new Date().toString();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="drawer drawer-end">
          <input id={id} type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label for={id} className="drawer-button btn btn-ghost">
              <i className="ph ph-list text-xl" />
            </label>
          </div>
          <div className="drawer-side z-20">
            <label
              for={id}
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <li>
                <a hx-boost href="/">
                  Home
                </a>
              </li>
              <li>
                <a hx-boost href="/groups">
                  Groups
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="dropdown">
          <div
            tabIndex="0"
            role="button"
            className="btn btn-ghost btn-circle"
          ></div>
          <ul
            tabIndex="0"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a hx-boost href="/" className="btn btn-link text-xl">
          Maney
        </a>
      </div>
      <div className="navbar-end">
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
