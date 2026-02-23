import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const GuideArticleSchema = z.object({
  title: RequiredStringSchema,
  imageKey: RequiredStringSchema,
  // TODO: remove when backend allows omitting the description
  shortDesc: RequiredStringSchema,
  description: RequiredStringSchema,
  // TODO: uncomment
  // shortDesc: z.string().trim().nullish(),
  // description: z.string().trim().nullish(),
});
