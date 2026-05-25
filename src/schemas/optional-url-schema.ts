import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

export const OptionalUrlSchema = z
  .string()
  .trim()
  .url(FORM_ERROR_MESSAGES.INVALID_URL)
  .startsWith("https://", {
    message: FORM_ERROR_MESSAGES.INVALID_URL_SCHEME,
  })
  .or(z.literal(""))
  .nullish();
