import { z } from "zod";

import {
  IsoTimestampSchema,
  NumericIdSchema,
  RequiredStringSchema,
} from "@/schemas";

export const HolidaySchema = z.object({
  academicCalendarId: NumericIdSchema,
  startDate: IsoTimestampSchema,
  lastDate: IsoTimestampSchema,
  description: RequiredStringSchema,
});
