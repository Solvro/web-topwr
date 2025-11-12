import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const MilestonesSchema = z.object({
  name: RequiredStringSchema,
});
