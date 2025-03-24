import { WSContext } from "hono/ws";
import { ToastCmp, ToastProps } from "../components/toast";

// Create a controller for the stream
// let streamController: TransformStreamDefaultController<string> | null = null;
// This is the stream that will be written to when new notifications arrive
// const notificationStream = new TransformStream<string>();
// const notificationWriter = notificationStream.writable.getWriter();
let webSocketContext: WSContext<unknown> | undefined;

export const NotificationService = {
  init: (_: unknown, ws: WSContext<unknown>) => {
    webSocketContext = ws;
  },
  notify: async (t: ToastProps) => {
    console.log(webSocketContext?.readyState, t);
    if (webSocketContext?.readyState !== 1) {
      return;
    }
    const tmp = (await ToastCmp(t)) || "";
    webSocketContext.send(tmp);
  },
} as const;
