import type { SortFiltersFormValuesNarrowed } from "../types/internal";
import { SortDirection } from "./sort-direction";

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: null,
  sortDirection: SortDirection.Ascending,
  filters: [],
} satisfies SortFiltersFormValuesNarrowed;
