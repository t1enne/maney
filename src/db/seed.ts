import dayjs from "dayjs";
import { db } from "./kysely";
import { MOVEMENT_CATEGORIES } from "../consts/categories";

const makeMovement = (i: number) => {
  const date = dayjs().set("day", 1).set("month", 1).set("year", 2024);
  return {
    amount: Math.ceil(Math.random() * i),
    description: "a description",
    date: date.add(i, "day").toISOString(),
    category: Object.values(MOVEMENT_CATEGORIES)[i % 2 ? 0 : 1] || "",
    userId: 1,
  };
};
await db
  .insertInto("movement")
  .values(new Array(365).fill(0).map((_, i) => makeMovement(i)))
  .execute();
