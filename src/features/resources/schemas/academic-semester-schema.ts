import { IsoTimestampSchema, RequiredStringSchema } from "@/schemas";
import { z } from "zod";


export const AcademicSemesterSchema = z.object({
  name: RequiredStringSchema,
  semesterStartDate: IsoTimestampSchema,
  examSessionStartDate: IsoTimestampSchema,
  examSessionLastDate: IsoTimestampSchema,
  isFirstWeekEven: z.boolean(),
});