import { Hono } from "hono";
import { HomePage } from "../pages/home";

const home = new Hono();

home.get("/", (c) => {
  const year = c.req.query("year") || `${new Date().getFullYear()}`;
  const month = c.req.query("month") || `${new Date().getMonth()}`;
  return c.html(<HomePage month={+month} year={+year} />);
});

export default home;
