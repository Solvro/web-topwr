import { z } from "zod";

import { PositiveIntegerSchema } from "@/schemas";

export const MobileConfigSchema = z.object({
  cmsReferenceNumber: PositiveIntegerSchema,
  daySwapLookahead: PositiveIntegerSchema,
  translatorReferenceNumber: PositiveIntegerSchema,
});
