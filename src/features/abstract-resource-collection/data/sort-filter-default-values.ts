import { SortDirection } from "../enums";
import type { SortFiltersFormValuesNarrowed } from "../types/sort-filters";

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: null,
  sortDirection: SortDirection.Ascending,
  filters: [],
} satisfies SortFiltersFormValuesNarrowed;
