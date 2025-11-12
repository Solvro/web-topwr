import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { RequiredStringSchema } from "@/schemas/helpers";

export const LoginSchema = z.object({
  email: RequiredStringSchema.email({
    message: FORM_ERROR_MESSAGES.INVALID_EMAIL,
  }),
  password: RequiredStringSchema,
  rememberMe: z.boolean(),
});
