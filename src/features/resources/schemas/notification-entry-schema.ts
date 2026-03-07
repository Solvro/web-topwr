import { z } from "zod";

import { OptionalUrlSchema, RequiredStringSchema } from "@/schemas";

export const NotificationEntrySchema = z.object({
  title: RequiredStringSchema,
  body: RequiredStringSchema,
  data: z.object({
    // the `data` object accepts arbitrary JSON so this is freely extendable by request from the mobile team
    route: OptionalUrlSchema,
  }),
});
