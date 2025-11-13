import { z } from "zod";

import { UnixTimestampSchema } from "@/schemas";

import { UserSchema } from "./user-schema";

export const AuthStateSchema = z
  .object({
    accessToken: z.string().jwt(),
    refreshToken: z.string().jwt(),
    accessTokenExpiresAt: UnixTimestampSchema,
    refreshTokenExpiresAt: UnixTimestampSchema,
    user: UserSchema,
  })
  .strict();
