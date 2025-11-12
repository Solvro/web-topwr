import { isEmptyValue, typedEntries } from "@/lib/helpers/typescript";
import type { SearchParameters } from "@/types/components";

import type { FilterDefinitions, FilteredField } from "../types/internal";

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
