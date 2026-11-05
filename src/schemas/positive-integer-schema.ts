import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

export const PositiveIntegerSchema = z.coerce
  .number()
  .int()
  .positive({ message: FORM_ERROR_MESSAGES.REQUIRED });
