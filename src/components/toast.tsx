import { FC } from "hono/jsx";
import { clsx } from "clsx";

export type ToastProps = {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  subtitle?: string;
};

export const ToastCmp: FC<ToastProps> = ({
  type = "info",
  title,
  subtitle,
}) => {
  // WARN: leave for tailwind classes generation
  const _classNames = "alert-info alert-warning alert-error alert-info";

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
  return (
    <aside
      id="toaster"
      className="toast toast-top toast-start stack"
      hx-swap-oob="beforeend"
    >
      <div
        role="alert"
        className={`alert alert-vertical sm:alert-horizontal max-w-96 min-w-48 alert-${type} alert-soft `}
        x-init="setTimeout(() => $el?.remove(), 5000)"
      >
        <i className={clsx("ph", iconMap[type])} />
        <div>
          <h3 className="font-bold">{title ?? titleMap[type]}</h3>
          <div className="text-xs">{subtitle}</div>
        </div>
      </div>
    </aside>
  );
};
