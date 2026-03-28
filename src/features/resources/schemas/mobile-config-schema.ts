import { z } from "zod";

import { PositiveIntegerSchema, RequiredUrlSchema } from "@/schemas";

export const MobileConfigSchema = z.object({
  sksMicroserviceUrl: RequiredUrlSchema,
  parkingMicroserviceUrl: RequiredUrlSchema,
  cmsReferenceNumber: PositiveIntegerSchema,
  daySwapLookahead: PositiveIntegerSchema,
  translatorReferenceNumber: PositiveIntegerSchema,
});
