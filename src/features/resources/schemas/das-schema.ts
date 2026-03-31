import { z } from "zod";

import { IsoTimestampSchema } from "@/schemas";

export const DasSchema = z.object({
  startsAt: IsoTimestampSchema,
  name: z.string(),
  timetableId: z.number().nullish(),
});
