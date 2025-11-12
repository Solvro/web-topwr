import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const RoleSchema = z.object({
  name: RequiredStringSchema,
});
