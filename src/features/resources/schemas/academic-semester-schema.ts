import { z } from "zod";

import { IsoTimestampSchema, RequiredStringSchema } from "@/schemas";

export const AcademicSemesterSchema = z.object({
  name: RequiredStringSchema,
  semesterStartDate: IsoTimestampSchema,
  examSessionStartDate: IsoTimestampSchema,
  examSessionLastDate: IsoTimestampSchema,
  isFirstWeekEven: z.boolean(),
});
