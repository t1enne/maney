import { FC } from "hono/jsx";

export type ToastProps = {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  subtitle?: string;
};

export const ToastCmp: FC<ToastProps> = ({ type = "", title, subtitle }) => {
  const _className = "alert-info alert-error alert-warning alert-success";
  return (
    <aside id="toaster" className="toast toast-bottom" hx-swap-oob="beforeend">
      <div
        role="alert"
        className={`alert alert-${type} max-w-96`}
        x-init="setTimeout(() => $el.remove(), 5000)"
      >
        <div>
          <h3 className="font-bold">{title}</h3>
          <div className="text-xs">{subtitle}</div>
        </div>
      </div>
    </aside>
  );
};
