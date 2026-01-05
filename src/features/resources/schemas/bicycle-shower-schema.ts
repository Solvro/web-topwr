import { z } from "zod";

import { Branch } from "../enums";

export const BicycleShowerSchema = z.object({
  room: z.string().nullish(),
  instructions: z.string().nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  branch: z.nativeEnum(Branch),
  photoKey: z.string().nullish(),
  buildingId: z.number().nullish(),
});
