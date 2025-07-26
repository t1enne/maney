import { FC } from "hono/jsx";
import { clsx } from "clsx";

export type ToastProps = {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  subtitle?: string;
  duration?: number;
};

export const ToastCmp: FC<ToastProps> = ({
  type = "info",
  title,
  subtitle,
  duration = 25000,
}) => {
  // WARN: leave for tailwind classes generation
  const _classNames = "text-success text-warning text-error text-primary";

  const iconMap: Record<NonNullable<ToastProps["type"]>, string> = {
    info: "ph-info",
    success: "ph-check-circle",
    warning: "ph-warning",
    error: "ph-radioactive",
  };
  const titleMap: Record<NonNullable<ToastProps["type"]>, string> = {
    info: "Info",
    success: "Success",
    warning: "Warning",
    error: "Error",
  };

  const iconColorMap: Record<NonNullable<ToastProps["type"]>, string> = {
    info: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  const id = Date.now();

  return (
    <aside
      id="toaster"
      x-data
      className="toast fixed z-10 top-0 left-0 pl-12 pt-24 pointer-events-none"
      hx-swap-oob="beforeend"
    >
      <div
        className="toast-wrapper"
        x-init={`setTimeout(() => $el?.remove(), ${duration})`}
        x-ref={`toast-${id}`}
      >
        <div
          role="alert"
          className={`alert alert-horizontal pointer-events-auto w-64`}
        >
          <i
            className={clsx("ph text-xl", iconMap[type], iconColorMap[type])}
          />
          <div>
            <h3 className="font-bold">{title ?? titleMap[type]}</h3>
            <div className="text-xs">{subtitle}</div>
          </div>
          <button
            class="btn btn-sm"
            x-on:click={`$refs['toast-${id}']?.remove()`}
          >
            <i className="ph ph-x" />
          </button>
        </div>
      </div>
    </aside>
  );
};
