import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

export const ColorValueSchema = z
  .string({ message: FORM_ERROR_MESSAGES.REQUIRED })
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/);
