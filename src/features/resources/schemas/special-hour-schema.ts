import { z } from "zod";

import { IsoTimestampSchema, RequiredStringSchema } from "@/schemas";

export const SpecialHourSchema = z.object({
  specialDate: IsoTimestampSchema,
  openTime: RequiredStringSchema,
  closeTime: RequiredStringSchema,
  libraryId: z.number(),
});
