import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

export const GuideArticleSchema = z.object({
  title: RequiredStringSchema,
  imageKey: RequiredStringSchema,
  shortDesc: RequiredStringSchema,
  // TODO: change when backend allows omitting the description
  // https://github.com/Solvro/backend-topwr/issues/281
  description: RequiredStringSchema,
  // description: z.string().trim().nullish(),
});
