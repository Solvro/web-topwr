import { IsoTimestampSchema, NumericIdSchema, RequiredStringSchema } from "@/schemas";
import { z } from "zod";

export const HolidaySchema = z.object({
  academicCalendarId: NumericIdSchema,
  startDate: IsoTimestampSchema,
  lastDate: IsoTimestampSchema,
  description: RequiredStringSchema,
});