import {
  IMPLICIT_SORTABLE_FIELDS,
  SORT_DIRECTION_SEPARATOR,
} from "@/config/constants";
import { FilterType } from "@/config/enums";
import type { SortDirection } from "@/config/enums";
import type { FilterDefinitions, SearchParameters } from "@/types/components";
import type { FilteredField, SortFiltersFormValues } from "@/types/forms";
import type { DeclinableNoun } from "@/types/polish";

import {
  isDeclinableNoun,
  isEmptyValue,
  isValidSortDirection,
  typedEntries,
} from "./typescript";

/** Parses the filters from client-side search parameters. */
export const parseFilterSearchParameters = (
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

/** Converts the sort filter values into search parameters. */
export const getSearchParametersFromSortFilters = (
  values: SortFiltersFormValues,
) => {
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

/** Parses a string like +field or -field into distinct, URI-encodable values. */
export const parseSortParameter = (
  sortParameter: string | undefined,
  sortableFields?: DeclinableNoun[],
): { sortDirection: SortDirection; sortBy: DeclinableNoun } | null => {
  if (isEmptyValue(sortParameter)) {
    return null;
  }
  const [sortDirection, sortBy] = sortParameter.split(
    SORT_DIRECTION_SEPARATOR,
    2,
  );
  if (isEmptyValue(sortBy) || !isValidSortDirection(sortDirection)) {
    return null;
  }
  if (!isDeclinableNoun(sortBy)) {
    console.warn("Undeclinable noun used as sort field", { sortBy });
    return null;
  }
  if (
    sortableFields != null &&
    ![...IMPLICIT_SORTABLE_FIELDS, ...sortableFields].includes(sortBy)
  ) {
    return null;
  }
  return { sortDirection, sortBy };
};

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
