import { z } from "zod";

import { RequiredStringSchema, StringDateSchema } from "@/schemas";

export const AcademicSemesterSchema = z.object({
  name: RequiredStringSchema,
  semesterStartDate: StringDateSchema,
  examSessionStartDate: StringDateSchema,
  examSessionLastDate: StringDateSchema,
  isFirstWeekEven: z.boolean(),
});
