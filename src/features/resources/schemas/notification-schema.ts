import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import { OptionalUrlSchema, RequiredStringSchema } from "@/schemas";

export const NotificationSchema = z.object({
  notification: z.object({
    title: RequiredStringSchema,
    body: RequiredStringSchema,
    data: z.object({
      // the `data` object accepts arbitrary JSON so this is freely extendable by request from the mobile team
      route: OptionalUrlSchema,
    }),
  }),
  topics: z.array(RequiredStringSchema).min(1, {
    message: FORM_ERROR_MESSAGES.SELECTION_REQUIRED,
  }),
});
