import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

export const DasOrganizationSchema = z.object({
  name: RequiredStringSchema,
  description: z.string().nullish(),
  logoKey: z.string().nullish(),
  studentOrganizationId: NumericIdSchema.nullish(),
});
