import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { NumericIdSchema, RequiredStringSchema } from "@/schemas/helpers";

import { ChangeType } from "../enums";

export const ChangesSchema = z.object({
  name: RequiredStringSchema,
  description: RequiredStringSchema,
  versionId: NumericIdSchema,
  type: z.nativeEnum(ChangeType, {
    required_error: FORM_ERROR_MESSAGES.REQUIRED,
  }),
});
