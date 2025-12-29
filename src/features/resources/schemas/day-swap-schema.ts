import { z } from "zod";

import { Weekday } from "@/config/enums";
import { NumericIdSchema, StringDateSchema } from "@/schemas";

export const DaySwapSchema = z.object({
  academicCalendarId: NumericIdSchema,
  date: StringDateSchema,
  changedWeekday: z.nativeEnum(Weekday),
  changedDayIsEven: z.boolean(),
});
