import * as z from "zod";

export const JwtPayload = z.object({
  exp: z.number(),
  userId: z.number(),
  mail: z.string(),
});
