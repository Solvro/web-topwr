import { z } from "zod";

import { EmailSchema, IsoTimestampSchema, NumericIdSchema } from "@/schemas";

export const UserSchema = z
  .object({
    id: NumericIdSchema,
    fullName: z.string().nullable(),
    email: EmailSchema,
    createdAt: IsoTimestampSchema,
    updatedAt: IsoTimestampSchema,
  })
  .strict();
