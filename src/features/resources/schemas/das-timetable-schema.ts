import { z } from "zod";

export const DasTimetableSchema = z.object({
  name: z.string(),
});
