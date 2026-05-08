import { z } from "zod";

import { IsoTimestampSchema } from "@/schemas";

export const DasSchema = z.object({
  name: z.string(),
  startsAt: IsoTimestampSchema,
  endsAt: IsoTimestampSchema,
  timetableId: z.number(),
});
