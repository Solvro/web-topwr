import { z } from "zod";

export const FilteredFieldSchema = z.object({
  field: z.string(),
  value: z.string(),
});
