import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

import { LinkType } from "../enums";

export const StudentOrganizationLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
  studentOrganizationId: NumericIdSchema,
});
