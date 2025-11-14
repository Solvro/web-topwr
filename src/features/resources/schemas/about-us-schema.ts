import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const AboutUsSchema = z.object({
  description: RequiredStringSchema,
  coverPhotoKey: RequiredStringSchema,
});
