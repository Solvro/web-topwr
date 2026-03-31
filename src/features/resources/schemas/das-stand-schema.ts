import { z } from "zod";

export const DasStandSchema = z.object({
  dasId: z.number(),
  name: z.string(),
  number: z.number(),
  floor: z.string().nullish(),
  description: z.string().nullish(),
  studentOrganizationId: z.number().nullish(),
  logoKey: z.string().nullish(),
});
