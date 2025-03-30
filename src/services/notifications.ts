import { WSContext } from "hono/ws";
import { ToastCmp, ToastProps } from "../components/toast";

let webSocketContext: WSContext<unknown> | undefined;

export const NotificationService = {
  init: (_: unknown, ws: WSContext<unknown>) => {
    webSocketContext = ws;
  },
  notify: async (t: ToastProps) => {
    if (webSocketContext?.readyState !== 1) {
      return;
    }
    const tmp = (await ToastCmp(t)) || "";
    webSocketContext.send(tmp);
  },
} as const;
