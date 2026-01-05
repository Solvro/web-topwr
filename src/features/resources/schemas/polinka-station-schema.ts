import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { Branch, ExternalDigitalGuideMode } from "../enums";

export const PolinkaStationSchema = z.object({
  name: RequiredStringSchema,
  campusId: z.number().nullish(),
  addressLine1: RequiredStringSchema,
  addressLine2: z.string().nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  branch: z.nativeEnum(Branch),
  photoKey: z.string().nullish(),
  externalDigitalGuideMode: z.nativeEnum(ExternalDigitalGuideMode).nullish(),
  externalDigitalGuideIdOrUrl: z.string().nullish(),
});
