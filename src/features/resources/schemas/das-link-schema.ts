import { z } from "zod";

import {
  NumericIdSchema,
  RequiredLinkSchema,
  RequiredStringSchema,
} from "@/schemas";

import { LinkType } from "../enums";

export const DasLinkSchema = z.object({
  dasId: NumericIdSchema,
  link: RequiredLinkSchema,
  type: z.nativeEnum(LinkType),
  title: RequiredStringSchema,
  subtitle: z.string().nullish(),
});
