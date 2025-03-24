import { Hono } from "hono";
import { HomePage } from "../pages/home";
import { Movement } from "../types/models/Movement";
import { MovementUpsert } from "../pages/movement";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { NotificationService } from "../services/notifications";

const MovementBodySchema = z.object({
  amount: z.number().gt(1),
  description: z.string(),
  date: z.date(),
  userId: z.string(),
});

const home = new Hono();
home.get("/", (c) =>
  c.html(
    <HomePage month={1} year={2011} movements={[] as Movement[]} total={10} />,
  ));

home.get("/movement", (c) => {
  return c.html(<MovementUpsert />);
});

home.post("/movement", async (c) => {
  console.log("the fuck");
  const formData = await c.req.formData();
  const submission = parseWithZod(formData, {
    schema: MovementBodySchema,
  });
  console.log(submission.payload);
  if (submission.status !== "success") {
    const errors = submission.reply();
    NotificationService.notify({
      type: "error",
      title: "Errors found",
      subtitle: "Please review the data",
    });
    c.status(500);
    return c.html(<MovementUpsert />);
  }
  NotificationService.notify({
    subtitle: "Movement created!",
    title: "Success",
  });
  return c.redirect("/");
});
// // Store active connections
// const clients = new Set<WritableStream>();
//
// home.get("/notifications", async (c) => {
//   return streamSSE(c, async (stream) => {
//     // Create a new stream for this client
//     const notificationStream = new WritableStream({
//       async write(chunk) {
//         await stream.writeSSE({
//           event: "message",
//           data: chunk.toString(),
//         });
//       },
//     });
//
//     // Add to clients set
//     clients.add(notificationStream);
//
//     // Remove when connection closes
//     c.req.raw.signal.addEventListener("abort", () => {
//       console.log("abort signal");
//       clients.delete(notificationStream);
//     });
//
//     // Keep the connection open
//     while (!c.req.raw.signal.aborted) {
//       console.log("senging hello");
//       await notificationStream.getWriter().write("hello");
//       console.log("sent hello");
//       await stream.sleep(500);
//     }
//   });
// });

export default home;
