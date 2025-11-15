import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { LOG_LEVELS } from "../data/log-levels";

export const LogPayloadSchemaServer = z
  .object({
    level: z.enum(LOG_LEVELS),
    message: RequiredStringSchema,
  })
  .passthrough();
