import { z } from "zod";

import { NumericIdSchema, RequiredLinkSchema } from "@/schemas";

import { LinkType } from "../enums";

export const ContributorSocialLinkSchema = z.object({
  contributorId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredLinkSchema,
});
