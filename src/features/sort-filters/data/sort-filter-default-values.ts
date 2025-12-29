import { SortDirection } from "../enums";
import type { SortFiltersFormValuesNarrowed } from "../types/internal";

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: null,
  sortDirection: SortDirection.Ascending,
  filters: [],
} satisfies SortFiltersFormValuesNarrowed;
