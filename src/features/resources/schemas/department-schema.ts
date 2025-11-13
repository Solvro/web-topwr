import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { ColorValueSchema, RequiredStringSchema } from "@/schemas/helpers";

import { UniversityBranch } from "../enums";

export const DepartmentSchema = z.object({
  name: RequiredStringSchema,
  addressLine1: RequiredStringSchema,
  addressLine2: RequiredStringSchema,
  code: RequiredStringSchema.regex(/W[0-9]{1,2}[A-Z]?/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_CODE,
  }),
  betterCode: RequiredStringSchema.regex(/W[A-Z]+/, {
    message: FORM_ERROR_MESSAGES.INVALID_DEPARTMENT_BETTER_CODE,
  }),
  logoKey: RequiredStringSchema,
  description: z.string().nullish(),
  gradientStart: ColorValueSchema.nullish(),
  gradientStop: ColorValueSchema.nullish(),
  branch: z.nativeEnum(UniversityBranch),
});
