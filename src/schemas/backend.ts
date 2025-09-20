import { z } from "zod";

import { isoTimestamp, timestampNumber } from "@/lib/helpers";

export const UserSchema = z
  .object({
    id: z.number().int().positive(),
    fullName: z.string().nullable(),
    email: z.string().email(),
    createdAt: isoTimestamp(),
    updatedAt: isoTimestamp(),
  })
  .strict();

export const AuthStateSchema = z
  .object({
    accessToken: z.string().jwt(),
    refreshToken: z.string().jwt(),
    accessTokenExpiresAt: timestampNumber(),
    refreshTokenExpiresAt: timestampNumber(),
    user: UserSchema,
  })
  .strict();
