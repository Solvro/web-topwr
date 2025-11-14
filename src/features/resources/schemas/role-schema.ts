import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const RoleSchema = z.object({
  name: RequiredStringSchema,
});
