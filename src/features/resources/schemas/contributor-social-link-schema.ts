import { z } from "zod";

import { NumericIdSchema, RequiredUrlSchema } from "@/schemas";

import { LinkType } from "../enums";

export const ContributorSocialLinkSchema = z.object({
  contributorId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredUrlSchema,
});
