import { z } from "zod";

import { LinkType } from "../enums";

export const DasLinkSchema = z.object({
  dasId: z.number(),
  link: z.string(),
  type: z.nativeEnum(LinkType),
  title: z.string(),
  subtitle: z.string().nullish(),
});
