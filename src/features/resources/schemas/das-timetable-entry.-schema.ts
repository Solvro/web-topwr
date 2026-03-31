import { z } from "zod";

import { IsoTimestampSchema } from "@/schemas";

export const DasTimetableEntrySchema = z.object({
  timetableId: z.number(),
  name: z.string(),
  startTime: IsoTimestampSchema,
  endTime: IsoTimestampSchema,
});
