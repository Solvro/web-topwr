import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const NotificationSchema = z.object({
  notification: z.object({
    title: RequiredStringSchema,
    body: RequiredStringSchema,
  }),
  topics: z.array(RequiredStringSchema),
});
