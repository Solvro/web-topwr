import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";

import { RequiredStringSchema } from "./required-string-schema";

export const RequiredUrlSchema = RequiredStringSchema.url(
  FORM_ERROR_MESSAGES.INVALID_URL,
).refine((data) => data.startsWith("https://"), {
  message: FORM_ERROR_MESSAGES.INVALID_URL,
});
