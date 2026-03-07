import { z } from "zod";

import {
  NumericIdSchema,
  OptionalUrlSchema,
  RequiredStringSchema,
} from "@/schemas";

import { StudiesType } from "../enums";

export const MajorSchema = z.object({
  name: RequiredStringSchema,
  url: OptionalUrlSchema,
  isEnglish: z.boolean().default(false),
  studiesType: z.nativeEnum(StudiesType),
  hasWeekendOption: z.boolean().default(false),
  departmentId: NumericIdSchema,
});
