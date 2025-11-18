import { Weekday } from "@/config/enums";
import { IsoTimestampSchema, NumericIdSchema } from "@/schemas";
import { z } from "zod";

export const DaySwapSchema = z.object({
  academicCalendarId: NumericIdSchema,
  date: IsoTimestampSchema,
  changedWeekday: z.nativeEnum(Weekday),
  changedDayIsEven: z.boolean(),
});