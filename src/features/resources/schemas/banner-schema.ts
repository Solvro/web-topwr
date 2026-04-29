import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/data/form-error-messages";
import {
  ColorValueSchema,
  IsoTimestampSchema,
  OptionalUrlSchema,
  RequiredStringSchema,
} from "@/schemas";

export const BannerSchema = z
  .object({
    title: RequiredStringSchema,
    description: RequiredStringSchema,
    url: OptionalUrlSchema,
    draft: z.boolean().default(true),
    textColor: ColorValueSchema.nullish(),
    backgroundColor: ColorValueSchema.nullish(),
    titleColor: ColorValueSchema.nullish(),
    visibleFrom: IsoTimestampSchema.nullish(),
    visibleUntil: IsoTimestampSchema.nullish(),
    shouldRender: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.visibleFrom != null && data.visibleUntil != null) {
        return new Date(data.visibleFrom) < new Date(data.visibleUntil);
      }
      return true;
    },
    {
      message: FORM_ERROR_MESSAGES.INVALID_END_DATE,
      path: ["visibleUntil"],
    },
  );
