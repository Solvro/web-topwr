import { z } from "zod";

export const DasMapSchema = z.object({
  dasId: z.number(),
  name: z.string(),
  contentKey: z.string(),
});
