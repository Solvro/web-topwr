import { z } from "zod";

import {
  IsoTimestampSchema,
  NumericIdSchema,
  UnixTimestampSchema,
} from "./helpers";

export const UserSchema = z
  .object({
    id: NumericIdSchema,
    fullName: z.string().nullable(),
    email: z.string().email(),
    createdAt: IsoTimestampSchema,
    updatedAt: IsoTimestampSchema,
  })
  .strict();

export const AuthStateSchema = z
  .object({
    accessToken: z.string().jwt(),
    refreshToken: z.string().jwt(),
    accessTokenExpiresAt: UnixTimestampSchema,
    refreshTokenExpiresAt: UnixTimestampSchema,
    user: UserSchema,
  })
  .strict();
