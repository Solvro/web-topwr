import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { Branch, ExternalDigitalGuideMode } from "../enums";

export const BuildingSchema = z.object({
  identifier: RequiredStringSchema,
  specialName: z.string().nullish(),
  campusId: z.number().nullish(),
  addressLine1: RequiredStringSchema,
  addressLine2: z.string().nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  haveFood: z.boolean(),
  branch: z.nativeEnum(Branch),
  coverKey: z.string().nullish(),
  externalDigitalGuideMode: z.nativeEnum(ExternalDigitalGuideMode).nullish(),
  externalDigitalGuideIdOrUrl: z.string().nullish(),
});
