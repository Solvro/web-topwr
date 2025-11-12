import { z } from "zod";

import { RequiredStringSchema } from "@/schemas/helpers";

export const GuideArticleSchema = z.object({
  title: RequiredStringSchema,
  imageKey: RequiredStringSchema,
  shortDesc: RequiredStringSchema,
  description: RequiredStringSchema,
});
