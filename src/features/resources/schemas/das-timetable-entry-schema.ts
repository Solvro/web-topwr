import { z } from "zod";

import {
  IsoTimestampSchema,
  NumericIdSchema,
  RequiredStringSchema,
} from "@/schemas";

export const DasTimetableEntrySchema = z.object({
  timetableId: NumericIdSchema,
  name: RequiredStringSchema,
  startTime: IsoTimestampSchema,
  endTime: IsoTimestampSchema.nullish(),
});
