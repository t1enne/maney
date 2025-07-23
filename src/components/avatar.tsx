import { getCookie } from "hono/cookie";
import { withJwt } from "../utils";
import { useRequestContext } from "hono/jsx-renderer";

export const AvatarDropdown = () => {
  const c = useRequestContext();

  const cookie = getCookie(c, "jwt");
  const { mail } = cookie ? withJwt(c) : {};
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex="0" role="button" class="avatar avatar-placeholder">
        {mail && (
          <div class="bg-neutral text-neutral-content w-8 rounded-full">
            <span class="text-xs uppercase">{mail.slice(0, 2)}</span>
          </div>
        )}
      </div>
      <ul
        tabIndex="0"
        class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <a className="btn btn-soft btn-error !px-2" href="/auth/logout">
            Logout 🚪
          </a>
        </li>
      </ul>
    </div>
  );
};
