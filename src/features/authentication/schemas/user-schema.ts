import { z } from "zod";

import { EmailSchema, IsoTimestampSchema, NumericIdSchema } from "@/schemas";

import { PermissionSchema } from "./permission-schema";
import { RoleSchema } from "./role-schema";

export const UserSchema = z
  .object({
    id: NumericIdSchema,
    fullName: z.string().nullable(),
    email: EmailSchema,
    createdAt: IsoTimestampSchema,
    updatedAt: IsoTimestampSchema,
    roles: z.array(RoleSchema),
    permissions: z.array(PermissionSchema),
  })
  .strict();
