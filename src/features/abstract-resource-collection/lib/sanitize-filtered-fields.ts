import { isEmptyValue } from "@/lib/helpers/typescript";

import { FilterType } from "../data/filter-type";
import type { FilterDefinitions, FilteredField } from "../types/internal";

/** Converts the client-side search parameters to backend-compatible filters. */
export const sanitizeFilteredFields = (
  filterDefinitions: Partial<FilterDefinitions>,
  filters: FilteredField[],
) => {
  const searchParameters = new URLSearchParams();
  for (const { field, value } of filters) {
    if (isEmptyValue(value)) {
      continue;
    }
    const options = filterDefinitions[field];
    if (options == null) {
      if (process.env.NODE_ENV !== "test") {
        console.warn("Ignoring unknown filter parameter", { field, value });
      }
      continue;
    }
    const filterValue = options.type === FilterType.Text ? `%${value}%` : value;
    searchParameters.set(field, filterValue);
  }
  return searchParameters;
};
