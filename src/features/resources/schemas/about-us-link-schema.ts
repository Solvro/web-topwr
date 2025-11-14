import { z } from "zod";

import { RequiredStringSchema } from "@/schemas";

import { LinkType } from "../enums";

export const AboutUsLinkSchema = z.object({
  linkType: z.nativeEnum(LinkType),
  link: RequiredStringSchema.url(),
});
