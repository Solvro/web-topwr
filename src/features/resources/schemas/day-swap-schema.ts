import { z } from "zod";

import { Weekday } from "@/config/enums";
import { IsoTimestampSchema, NumericIdSchema } from "@/schemas";

export const DaySwapSchema = z.object({
  academicCalendarId: NumericIdSchema,
  date: IsoTimestampSchema,
  changedWeekday: z.nativeEnum(Weekday),
  changedDayIsEven: z.boolean(),
});
