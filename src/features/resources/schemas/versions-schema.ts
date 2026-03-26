import { z } from "zod";

import {
  NumericIdSchema,
  RequiredStringSchema,
  StringDateSchema,
} from "@/schemas";

export const VersionsSchema = z.object({
  name: RequiredStringSchema,
  description: z.string().nullish(),
  releaseDate: StringDateSchema,
  milestoneId: NumericIdSchema,
});
