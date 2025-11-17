import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

export const SksOpeningHoursSchema = z.object({
  language: RequiredStringSchema.min(2, {
    message: FORM_ERROR_MESSAGES.VALUE_TOO_SHORT(2),
  }).toLowerCase(),
  canteen: RequiredStringSchema,
  cafe: RequiredStringSchema,
});
