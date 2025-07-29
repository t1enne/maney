import { WSContext } from "hono/ws";
import { ToastCmp, ToastProps } from "../components/toast";

let webSocketContext: WSContext<unknown> | undefined;

async function notify(t: ToastProps) {
  if (webSocketContext?.readyState !== 1) {
    return;
  }
  const tmp = await ToastCmp(t);
  webSocketContext.send(tmp ?? "");
}

export const ToastSvc = {
  init: (_: unknown, ws: WSContext<unknown>) => {
    webSocketContext = ws;
    ToastSvc.success({ title: "Toasts init" });
  },
  success: (t: ToastProps) => notify({ ...t, type: "success" }),
  info: (t: ToastProps) => notify({ ...t, type: "info" }),
  error: (t: ToastProps) => notify({ ...t, type: "error" }),
  warning: (t: ToastProps) => notify({ ...t, type: "warning" }),
} as const;
