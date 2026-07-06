import { z } from "zod";

import { PositiveIntegerSchema, RequiredUrlSchema } from "@/schemas";

export const MobileConfigSchema = z.object({
  boothsApiBaseUrl: RequiredUrlSchema,
  boothsEnabled: z.boolean(),
  sksMicroserviceUrl: RequiredUrlSchema,
  parkingMicroserviceUrl: RequiredUrlSchema,
  cmsReferenceNumber: PositiveIntegerSchema,
  daySwapLookahead: PositiveIntegerSchema,
  translatorReferenceNumber: PositiveIntegerSchema,
});
