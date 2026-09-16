import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

export const DasMapSchema = z.object({
  dasId: NumericIdSchema,
  name: RequiredStringSchema,
  contentKey: RequiredStringSchema,
});
