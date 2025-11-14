import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const MilestonesSchema = z.object({
  name: RequiredStringSchema,
});
