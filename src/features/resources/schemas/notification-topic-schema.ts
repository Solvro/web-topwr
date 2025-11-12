import { z } from "zod";

import { FORM_ERROR_MESSAGES, TOPIC_NAME_REGEX } from "@/config/constants";
import { RequiredStringSchema } from "@/schemas/helpers";

export const NotificationTopicSchema = z.object({
  topicName: RequiredStringSchema.regex(TOPIC_NAME_REGEX, {
    message: FORM_ERROR_MESSAGES.INVALID_TOPIC_NAME,
  }),
  isActive: z.boolean().default(false),
  deactivatedAt: z.string().datetime().nullish(),
  description: z.string().nullish(),
});
