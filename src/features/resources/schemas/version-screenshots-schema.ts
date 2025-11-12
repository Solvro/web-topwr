import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

export const VersionScreenshotsSchema = z.object({
  versionId: NumericIdSchema,
  imageKey: RequiredStringSchema,
  subtitle: z.string().nullish(),
});
