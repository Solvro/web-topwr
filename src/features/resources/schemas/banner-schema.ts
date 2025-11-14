import { z } from "zod";

import {
  ColorValueSchema,
  IsoTimestampSchema,
  RequiredStringSchema,
} from "@/schemas";

export const BannerSchema = z.object({
  title: RequiredStringSchema,
  description: RequiredStringSchema,
  url: z.string().url().nullish(),
  draft: z.boolean().default(true),
  textColor: ColorValueSchema.nullish(),
  backgroundColor: ColorValueSchema.nullish(),
  titleColor: ColorValueSchema.nullish(),
  visibleFrom: IsoTimestampSchema.nullish(),
  visibleUntil: IsoTimestampSchema.nullish(),
  shouldRender: z.boolean().default(false),
});
