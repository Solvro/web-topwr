import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

export const EmailSchema = z
  .string()
  .trim()
  .email({ message: FORM_ERROR_MESSAGES.INVALID_EMAIL });
