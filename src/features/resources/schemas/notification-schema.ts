import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { RequiredStringSchema } from "@/schemas";

import { NotificationEntrySchema } from "./notification-entry-schema";

export const NotificationSchema = z.object({
  notification: NotificationEntrySchema,
  topics: z.array(RequiredStringSchema).min(1, {
    message: FORM_ERROR_MESSAGES.SELECTION_REQUIRED,
  }),
});
