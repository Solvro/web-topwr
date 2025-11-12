import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

export const GuideQuestionSchema = z.object({
  title: RequiredStringSchema,
  answer: RequiredStringSchema,
  articleId: NumericIdSchema,
});
