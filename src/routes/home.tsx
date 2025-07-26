import { Hono } from "hono";
import { HomePage } from "../pages/home";
import { withJwt } from "../utils";
import { ToastSvc } from "../services/notifications";

const home = new Hono();

home.get("/", (c) => {
  const year = c.req.query("year") || `${new Date().getFullYear()}`;
  const month = c.req.query("month") || `${new Date().getMonth()}`;
  const jwt = withJwt(c);
  return c.render(<HomePage userId={jwt.userId} month={+month} year={+year} />);
});

const btn = (type: string) => (
  <a role="button" className={`btn btn-sm`} hx-get={`/test/${type}`}>
    {type}
  </a>
);

home.get("/test/info", (c) => {
  ToastSvc.info({ subtitle: "A toast!" });
  return c.render(btn("info"));
});
home.get("/test/success", (c) => {
  ToastSvc.success({ subtitle: "A toast!" });
  return c.render(btn("success"));
});
home.get("/test/error", (c) => {
  ToastSvc.error({ subtitle: "A toast!" });
  return c.render(btn("error"));
});
home.get("/test/warning", (c) => {
  ToastSvc.warning({ subtitle: "A toast!" });
  return c.render(btn("warning"));
});

export default home;
