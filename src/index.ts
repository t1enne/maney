import { Hono } from "hono";
import authentication from "./routes/auth";
import login from "./routes/login";
import home from "./routes/home";
import groups from "./routes/groups";
import { serveStatic, createBunWebSocket } from "hono/bun";
import { ToastSvc } from "./services/notifications";
import { logger } from "hono/logger";
import movement from "./routes/movement";
import { sessionMiddleware } from "./middleware/sessions";
import { jsxRenderer } from "hono/jsx-renderer";
const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();

app.use(logger(), jsxRenderer());

app.use("/*", serveStatic({ root: "./static" }));
app.use("*", sessionMiddleware());

app.route("/", home);
app.route("/movement", movement);
app.route("/groups", groups);
app.route("/login", login);
app.route("/auth", authentication);

app.get(
  "/notifications",
  upgradeWebSocket((_) => {
    console.log("Upgrading websockets");
    return {
      onOpen: ToastSvc.init,
      onClose: () => {
        console.log(`WS connection closed`);
      },
      onError: () => {
        console.log(`WS connection errored`);
      },
    };
  }),
);

export default {
  fetch: app.fetch,
  websocket,
};
