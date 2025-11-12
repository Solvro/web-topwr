import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const AboutUsSchema = z.object({
  description: RequiredStringSchema,
  coverPhotoKey: RequiredStringSchema,
});
