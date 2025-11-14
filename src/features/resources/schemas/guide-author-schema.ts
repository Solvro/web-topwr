import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const GuideAuthorSchema = z.object({
  name: RequiredStringSchema,
});
