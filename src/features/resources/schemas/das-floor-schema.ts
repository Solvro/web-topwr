import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const DasFloorSchema = z.object({
  name: RequiredStringSchema,
});
