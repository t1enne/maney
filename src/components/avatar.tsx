export const AvatarDropdown = () => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex="0" role="button" class="avatar avatar-placeholder">
        <div class="bg-neutral text-neutral-content w-8 rounded-full">
          <span class="text-xs">UI</span>
        </div>
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
