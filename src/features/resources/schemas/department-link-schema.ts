import { z } from "zod";

import {
  NumericIdSchema,
  RequiredStringSchema,
  RequiredUrlSchema,
} from "@/schemas";

import { LinkType } from "../enums";

export const DepartmentLinkSchema = z.object({
  departmentId: NumericIdSchema,
  linkType: z.nativeEnum(LinkType),
  link: RequiredUrlSchema,
  name: RequiredStringSchema,
});
