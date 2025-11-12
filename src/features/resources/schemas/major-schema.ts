import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

import { StudiesType } from "../enums";

export const MajorSchema = z.object({
  name: RequiredStringSchema,
  url: z.string().url().nullish(),
  isEnglish: z.boolean().default(false),
  studiesType: z.nativeEnum(StudiesType),
  hasWeekendOption: z.boolean().default(false),
  departmentId: NumericIdSchema,
});
