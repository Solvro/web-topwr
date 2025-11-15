import { z } from "zod";

import { PositiveIntegerSchema } from "@/schemas";

export const LogPayloadSchemaClient = z
  .object({
    level: PositiveIntegerSchema,
    msg: z.string().nullish(),
  })
  .passthrough();
