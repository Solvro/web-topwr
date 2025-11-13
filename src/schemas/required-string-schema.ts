import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

export const RequiredStringSchema = z
  .string({ required_error: FORM_ERROR_MESSAGES.REQUIRED })
  .trim()
  .min(1, { message: FORM_ERROR_MESSAGES.NONEMPTY });
