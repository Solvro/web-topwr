import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

import { LinkType } from "../enums";

export const ContributorSocialLinkSchema = z.object({
  contributorId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
});
