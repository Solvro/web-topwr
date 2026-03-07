import { z } from "zod";

import { RequiredUrlSchema } from "@/schemas";

import { LinkType } from "../enums";

export const AboutUsLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredUrlSchema,
});
