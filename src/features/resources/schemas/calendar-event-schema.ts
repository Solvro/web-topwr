import { z } from "zod";

import {
  ColorValueSchema,
  IsoTimestampSchema,
  RequiredStringSchema,
} from "@/schemas/helpers";

export const CalendarEventSchema = z.object({
  name: RequiredStringSchema,
  startTime: IsoTimestampSchema,
  endTime: IsoTimestampSchema,
  description: z.string().nullish(),
  location: z.string().nullish(),
  googleCalId: z.string().nullish(),
  accentColor: ColorValueSchema.nullish(),
});
