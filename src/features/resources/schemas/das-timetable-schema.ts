import { z } from "zod";

export const DasTimetableSchema = z.object({
  id: z.number(),
  name: z.string(),
});
