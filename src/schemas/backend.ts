import { z } from "zod";

import { isoTimestamp, numericId, timestampNumber } from "@/lib/helpers";

export const UserSchema = z
  .object({
    id: numericId(),
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
