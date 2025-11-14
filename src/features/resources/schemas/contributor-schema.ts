import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const ContributorSchema = z.object({
  name: RequiredStringSchema,
  photoKey: z.string().nullish(),
});
