import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const DasTimetableSchema = z.object({
  name: RequiredStringSchema,
});
