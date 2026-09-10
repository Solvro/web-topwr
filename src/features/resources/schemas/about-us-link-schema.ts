import { z } from "zod";

import { RequiredLinkSchema } from "@/schemas";

import { LinkType } from "../enums";

export const AboutUsLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredLinkSchema,
});
