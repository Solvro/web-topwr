import { z } from "zod";

import { UniversityBranch } from "../enums";

export const PinkBoxSchema = z.object({
  roomOrNearby: z.string().nullish(),
  floor: z.string().nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  branch: z.nativeEnum(UniversityBranch),
  photoKey: z.string().nullish(),
  buildingId: z.number().nullish(),
});
