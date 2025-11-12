import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const ContributorSchema = z.object({
  name: RequiredStringSchema,
  photoKey: z.string().nullish(),
});
