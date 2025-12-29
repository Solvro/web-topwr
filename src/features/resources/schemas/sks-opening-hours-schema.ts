import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

import { Language } from "../enums";

export const SksOpeningHoursSchema = z.object({
  language: z.nativeEnum(Language, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
  canteen: RequiredStringSchema,
  cafe: RequiredStringSchema,
});
