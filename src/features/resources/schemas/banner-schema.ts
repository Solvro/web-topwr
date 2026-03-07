import { z } from "zod";

import {
  ColorValueSchema,
  IsoTimestampSchema,
  OptionalUrlSchema,
  RequiredStringSchema,
} from "@/schemas";

export const BannerSchema = z.object({
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
});
