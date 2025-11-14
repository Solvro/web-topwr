import { isDeclinableNoun } from "@/features/polish";
import { isEmptyValue } from "@/utils";

import { SORT_DIRECTION_SEPARATOR } from "../constants";
import type { SortFiltersFormValues } from "../types/sort-filters";

/** Converts the sort filter values into search parameters. */
export const serializeSortFilters = (values: SortFiltersFormValues) => {
  const searchParameters = new URLSearchParams();
  if (isDeclinableNoun(values.sortBy)) {
    searchParameters.set(
      "sort",
      `${values.sortDirection}${SORT_DIRECTION_SEPARATOR}${values.sortBy}`,
    );
  }
  for (const filter of values.filters) {
    if (isEmptyValue(filter.field) || isEmptyValue(filter.value)) {
      continue;
    }
    searchParameters.set(filter.field, filter.value);
  }
  return searchParameters;
};
