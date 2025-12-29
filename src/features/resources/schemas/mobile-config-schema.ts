import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const MobileConfigSchema = z.object({
  cmsReferenceNumber: RequiredStringSchema,
  daySwapLookahead: RequiredStringSchema,
  translatorReferenceNumber: RequiredStringSchema,
});
