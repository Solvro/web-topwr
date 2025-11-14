import { z } from "zod";

import { NumericIdSchema, RequiredStringSchema } from "@/schemas";

import { LinkType } from "../enums";

export const DepartmentLinkSchema = z.object({
  departmentId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
  name: RequiredStringSchema,
});
