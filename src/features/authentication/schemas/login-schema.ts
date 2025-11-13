import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

export const LoginSchema = z.object({
  email: RequiredStringSchema.email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: RequiredStringSchema,
  rememberMe: z.boolean(),
});
