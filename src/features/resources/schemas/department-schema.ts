import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { ColorValueSchema, RequiredStringSchema } from "@/schemas";

import { UniversityBranch } from "../enums";

export const DepartmentSchema = z.object({
  name: RequiredStringSchema,
  addressLine1: RequiredStringSchema,
  addressLine2: z.string().trim(),
  code: RequiredStringSchema.regex(/W[0-9]{1,2}[A-Z]?/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_CODE,
  }),
  betterCode: RequiredStringSchema.regex(/W[A-Z]+/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_BETTER_CODE,
  }),
  logoKey: z.string(),
  description: z.string().nullish(),
  gradientStart: ColorValueSchema.min(1, FORM_ERROR_MESSAGES.REQUIRED),
  gradientStop: ColorValueSchema.min(1, FORM_ERROR_MESSAGES.REQUIRED),
  branch: z.nativeEnum(UniversityBranch),
});
