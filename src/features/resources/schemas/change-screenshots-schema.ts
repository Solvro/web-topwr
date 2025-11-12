import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

export const ChangeScreenshotsSchema = z.object({
  changeId: NumericIdSchema,
  imageKey: RequiredStringSchema,
  subtitle: z.string().nullish(),
});
