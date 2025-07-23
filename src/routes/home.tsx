import { Hono } from "hono";
import { HomePage } from "../pages/home";
import { withJwt } from "../utils";
import { NotificationService } from "../services/notifications";

const home = new Hono();

home.get("/", (c) => {
  const year = c.req.query("year") || `${new Date().getFullYear()}`;
  const month = c.req.query("month") || `${new Date().getMonth()}`;
  const jwt = withJwt(c);
  return c.render(<HomePage userId={jwt.userId} month={+month} year={+year} />);
});

// home.get("/test", (c) => {
//   NotificationService.notify({ type: "info", subtitle: "A toast!" });
//   return c.render(
//     <a role="button" className="btn btn-sm btn-info" hx-get="/test">
//       Tostami
//     </a>,
//   );
// });

export default home;
