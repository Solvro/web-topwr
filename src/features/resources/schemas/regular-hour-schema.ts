import { z } from "zod";

import { Weekday } from "@/config/enums";
import { RequiredStringSchema } from "@/schemas";

export const RegularHourSchema = z.object({
  weekDay: z.nativeEnum(Weekday),
  openTime: RequiredStringSchema,
  closeTime: RequiredStringSchema,
  libraryId: z.number(),
});
