import { Context, Hono } from "hono";
import { MovementUpsert } from "../pages/movement";
import { z } from "zod";
import { NotificationService } from "../services/notifications";
import { db } from "../db/kysely";
import { MovementCreate, MovementUpdate } from "../types/models/Movement";
import dayjs from "dayjs";
import { formToJson, withJwt } from "../utils";
import { MovementsRows } from "../components/movements-rows";

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
    NotificationService.notify({
      type: "error",
      title: "Errors found",
      subtitle: JSON.stringify(error.message),
    });
    c.status(422);
    return c.render(<MovementUpsert id={id} />);
  }
  await upsertMovement(
    {
      ...data,
      date: dayjs(data.date).toISOString(),
    },
    id,
  ).executeTakeFirstOrThrow();

  NotificationService.notify({
    subtitle: "Movement saved!",
    title: "Success",
    type: "success",
  });
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

movement.get("/create", (c) => c.render(<MovementUpsert />));
movement.post("/", upsert);

movement.get("/:id", (c) =>
  c.render(<MovementUpsert id={+c.req.param("id")} />),
);
movement.post("/:id", upsert);
movement.delete("/:id/delete", async (c) => {
  try {
    await db
      .deleteFrom("movement")
      .where("id", "=", +c.req.param("id"))
      .execute();
    NotificationService.notify({
      type: "success",
      subtitle: "Deleted!",
    });
  } catch (e) {
    NotificationService.notify({
      type: "error",
      subtitle: "Failed to complete operation",
    });
    return c.body("Failed");
  }

  return c.html("");
});

export default movement;
