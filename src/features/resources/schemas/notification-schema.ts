import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

export const NotificationSchema = z.object({
  notification: z.object({
    title: RequiredStringSchema,
    body: RequiredStringSchema,
  }),
  topics: z.array(RequiredStringSchema).min(1, {
    message: FORM_ERROR_MESSAGES.SELECTION_REQUIRED,
  }),
});
