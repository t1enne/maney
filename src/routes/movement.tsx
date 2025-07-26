import { Context, Hono } from "hono";
import { MovementUpsert } from "../pages/movement";
import { z } from "zod";
import { ToastSvc } from "../services/notifications";
import { db } from "../db/kysely";
import { MovementCreate, MovementUpdate } from "../types/models/Movement";
import dayjs from "dayjs";
import { formToJson, withJwt } from "../utils";
import { MovementsRows } from "../components/movements-rows";
import { padStart } from "es-toolkit/compat";

const MovementBodySchema = z.object({
  amount: z.coerce.number().gt(0),
  description: z.string(),
  date: z.coerce.date(),
  userId: z.coerce.number(),
});

const upsertMovement = (m: MovementCreate | MovementUpdate, id?: number) => {
  if (id) {
    return db.updateTable("movement").where("id", "=", id).set(m);
  }
  return db.insertInto("movement").values(m as MovementCreate);
};

const upsert = async (c: Context) => {
  const formData = await c.req.formData();
  const id = c.req.param("id") ? +c.req.param("id") : undefined;
  const { success, error, data } = MovementBodySchema.safeParse(
    formToJson(formData),
  );
  if (!success) {
    ToastSvc.error({ subtitle: JSON.stringify(error.message) });
    c.status(422);
    return c.body(error.message);
  }
  await upsertMovement(
    {
      ...data,
      date: dayjs(data.date).toISOString(),
    },
    id,
  ).executeTakeFirstOrThrow();

  ToastSvc.success({ subtitle: "Movement saved!", duration: 250000 });
  return c.redirect(
    `/?year=${dayjs(data.date).year()}&month=${dayjs(data.date).month()}`,
  );
};

const movement = new Hono();

movement.get("/page/:page", (c) => {
  const _page = c.req.param("page") || `${1}`;
  const year = c.req.query("year") || `${new Date().getFullYear()}`;
  const month = c.req.query("month") || `${new Date().getMonth()}`;
  const { userId } = withJwt(c);
  return c.render(
    <MovementsRows userId={userId} year={+year} month={+month} page={+_page} />,
  );
});

movement.get("/create", (c) => {
  const { userId } = withJwt(c);
  return c.render(<MovementUpsert userId={userId} />);
});

movement.post("/", upsert);

movement.get("/:id", (c) => {
  const { userId } = withJwt(c);
  return c.render(<MovementUpsert id={+c.req.param("id")} userId={userId} />);
});
movement.post("/:id", upsert);

movement.delete("/:id/delete", async (c) => {
  // doesnt work, use req.referer, which has ulr params
  const referer = c.req.header("referer");
  const url = new URL(referer ?? "", "http://localhost"); // base required for relative URLs
  const year = +url.searchParams.get("year")!;
  const month = +url.searchParams.get("month")!;

  const q = `${year}-${padStart(`${month + 1}`, 2, "0")}-%`;
  try {
    const { userId } = withJwt(c);

    await db
      .deleteFrom("movement")
      .where("id", "=", +c.req.param("id"))
      .execute();

    const total = await db
      .selectFrom("movement")
      .select((eb) => [eb.fn.sum("amount").as("totalAmount")])
      .where("date", "like", q)
      .where("movement.userId", "=", userId)
      .executeTakeFirst();

    ToastSvc.success({ subtitle: "Deleted!" });
    return c.html(
      <strong id="month-total" hx-swap-oob>
        {total?.totalAmount}
      </strong>,
    );
  } catch (e) {
    ToastSvc.error({ subtitle: "Failed to complete operation" });
    return c.body("Failed");
  }
});

export default movement;
