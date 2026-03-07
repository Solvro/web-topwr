import { z } from "zod";

import { NumericIdSchema, RequiredUrlSchema } from "@/schemas";

import { LinkType } from "../enums";

export const StudentOrganizationLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredUrlSchema,
  name: z.string().trim().nullish(),
  studentOrganizationId: NumericIdSchema,
});
