import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

export const DasStandSchema = z.object({
  dasId: NumericIdSchema,
  name: RequiredStringSchema,
  number: RequiredStringSchema,
  floorId: NumericIdSchema.nullish(),
  description: z.string().nullish(),
  dasOrganizationId: NumericIdSchema.nullish(),
  logoKey: z.string().nullish(),
});
