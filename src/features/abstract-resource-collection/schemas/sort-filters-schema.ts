import { z } from "zod";

import { SortDirection } from "../data/sort-direction";
import { FilteredFieldSchema } from "./filtered-field-schema";

export const SortFiltersSchema = z.object({
  sortBy: z.string().nullish(),
  sortDirection: z.nativeEnum(SortDirection),
  filters: z.array(FilteredFieldSchema),
});
