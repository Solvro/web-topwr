import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

export const VersionsSchema = z.object({
  name: RequiredStringSchema,
  description: z.string().nullish(),
  releaseDate: RequiredStringSchema.datetime(),
  milestoneId: NumericIdSchema,
});
