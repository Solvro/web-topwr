import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { Branch } from "../enums";

export const FoodSpotSchema = z.object({
  name: RequiredStringSchema,
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  branch: z.nativeEnum(Branch),
  photoKey: z.string().nullish(),
  buildingId: z.number().nullish(),
});
