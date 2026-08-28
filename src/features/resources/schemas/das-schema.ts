import { z } from "zod";

import { IsoTimestampSchema, RequiredStringSchema } from "@/schemas";

export const DasSchema = z.object({
  name: RequiredStringSchema,
  startsAt: IsoTimestampSchema,
  endsAt: IsoTimestampSchema,
});
