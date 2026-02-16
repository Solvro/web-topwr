import { z } from "zod";

import { EmailSchema, RequiredStringSchema } from "@/schemas";

import { Branch } from "../enums";

export const LibrarySchema = z.object({
  title: RequiredStringSchema,
  room: z.string().nullish(),
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  phone: z.string().nullish(),
  email: EmailSchema.nullish(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  branch: z.nativeEnum(Branch),
  photoKey: z.string().nullish(),
  buildingId: z.number().nullish(),
});
