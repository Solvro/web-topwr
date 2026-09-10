import { z } from "zod";

import { NumericIdSchema, RequiredLinkSchema } from "@/schemas";

import { LinkType } from "../enums";

export const StudentOrganizationLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredLinkSchema,
  name: z.string().trim().nullish(),
  studentOrganizationId: NumericIdSchema,
});
