import { z } from "zod";

export const RoleSchema = z
  .object({
    title: z.string().nullish(),
    slug: z.string(),
  })
  .strict();
