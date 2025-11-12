import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const GuideAuthorSchema = z.object({
  name: RequiredStringSchema,
});
