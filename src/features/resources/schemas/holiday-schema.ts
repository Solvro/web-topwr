import { z } from "zod";

import {
  NumericIdSchema,
  RequiredStringSchema,
  StringDateSchema,
} from "@/schemas";

export const HolidaySchema = z.object({
  academicCalendarId: NumericIdSchema,
  startDate: StringDateSchema,
  lastDate: StringDateSchema,
  description: RequiredStringSchema,
});
