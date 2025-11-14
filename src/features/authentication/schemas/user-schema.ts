import { z } from "zod";

import { IsoTimestampSchema, NumericIdSchema } from "@/schemas";

export const UserSchema = z
  .object({
    id: NumericIdSchema,
    fullName: z.string().nullable(),
    email: z.string().email(),
    createdAt: IsoTimestampSchema,
    updatedAt: IsoTimestampSchema,
  })
  .strict();
