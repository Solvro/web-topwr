import { z } from "zod";

import { RequiredStringSchema, StringDateSchema } from "@/schemas";

export const SpecialHourSchema = z.object({
  specialDate: StringDateSchema,
  openTime: RequiredStringSchema,
  closeTime: RequiredStringSchema,
  libraryId: z.number(),
});
