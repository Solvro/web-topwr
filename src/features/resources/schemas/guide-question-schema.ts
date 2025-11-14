import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

export const GuideQuestionSchema = z.object({
  title: RequiredStringSchema,
  answer: RequiredStringSchema,
  articleId: NumericIdSchema,
});
