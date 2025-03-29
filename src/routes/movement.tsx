import { Context, Hono } from "hono";
import { MovementUpsert } from "../pages/movement";
import { z } from "zod";
import { NotificationService } from "../services/notifications";
import { db } from "../db/kysely";
import { MovementCreate, MovementUpdate } from "../types/models/Movement";
import { formToJson } from "../utils";
import dayjs from "dayjs";
import { MovementsPage } from "../components/movements-page";

const MovementBodySchema = z.object({
  amount: z.coerce.number().gt(1),
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
      subtitle: JSON.stringify(error.flatten()),
    });
    c.status(500);

    return c.html(<MovementUpsert id={id} />);
  }
  await upsertMovement(
    {
      ...data,
      date: dayjs(data.date).toISOString(),
    },
    id,
  ).executeTakeFirst();
  NotificationService.notify({
    subtitle: "Movement created/updated!",
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
  return c.html(<MovementsPage year={+year} month={+month} page={+_page} />);
});

movement.get("/create", (c) => c.html(<MovementUpsert />));
movement.post("/", upsert);

movement.get("/:id", (c) => c.html(<MovementUpsert id={+c.req.param("id")} />));
movement.post("/:id", upsert);

export default movement;
