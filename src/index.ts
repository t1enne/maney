import { Hono } from "hono";
import authentication from "./routes/auth";
import login from "./routes/login";
import home from "./routes/home";
import { serveStatic } from "hono/bun";
import { createBunWebSocket } from "hono/bun";
import { NotificationService } from "./services/notifications";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use("/*", serveStatic({ root: "./static" }));

app.route("/", home);
app.route("/login", login);
app.route("/auth", authentication);

const { upgradeWebSocket, websocket } = createBunWebSocket();

app.get(
  "/notifications",
  upgradeWebSocket((_) => ({
    onOpen: NotificationService.init,
  })),
);

export default {
  fetch: app.fetch,
  websocket,
};
