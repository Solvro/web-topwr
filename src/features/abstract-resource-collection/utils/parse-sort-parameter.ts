import { isDeclinableNoun, isEmptyValue } from "@/lib/helpers/typescript";
import type { DeclinableNoun } from "@/types/polish";

import { SORT_DIRECTION_SEPARATOR } from "../constants";
import { IMPLICIT_SORTABLE_FIELDS } from "../data/implicit-sortable-fields";
import type { SortDirection } from "../enums";
import { isValidSortDirection } from "../utils/is-valid-sort-direction";

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
