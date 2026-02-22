import { z } from "zod";

import { NumericIdSchema } from "@/schemas";

export const PermissionSchema = z
  .object({
    action: z.string(),
    modelName: z.string(),
    // TODO?: loosen this to allow non-numeric IDs; potential to break if permissions are set for resources like student_organization_tags
    instanceId: NumericIdSchema.nullable(),
  })
  .strict();
