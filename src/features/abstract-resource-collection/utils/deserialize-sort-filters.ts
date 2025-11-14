import type { SearchParameters } from "@/types/components";
import { isEmptyValue, typedEntries } from "@/utils";

import type { FilterDefinitions, FilteredField } from "../types/sort-filters";

/** Parses the sort filters from client-side search parameters. */
export const deserializeSortFilters = (
  searchParameters: SearchParameters,
  filterDefinitions: FilterDefinitions,
): FilteredField[] =>
  typedEntries(searchParameters).reduce<FilteredField[]>(
    (filters, [field, value]) => {
      if (
        !isEmptyValue(field) &&
        field in filterDefinitions &&
        !isEmptyValue(value)
      ) {
        filters.push({ field, value });
      }
      return filters;
    },
    [],
  );
