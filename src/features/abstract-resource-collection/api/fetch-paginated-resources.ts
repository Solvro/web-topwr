import { fetchQuery } from "@/features/backend";
import type {
  GetResourcesResponse,
  GetResourcesResponsePaginated,
} from "@/features/backend/types";
import type { Resource } from "@/features/resources";

import { LIST_RESULTS_PER_PAGE } from "../constants";
import { SORT_FILTER_DEFAULT_VALUES } from "../data/sort-filter-default-values";
import { SortDirection } from "../enums";
import type {
  FilterDefinitions,
  SortFiltersFormValuesNarrowed,
} from "../types/sort-filters";
import { sanitizeFilteredFields } from "../utils/sanitize-filtered-fields";

export async function fetchPaginatedResources<
  T extends Resource,
  P extends number,
>(
  resource: T,
  page: P = 1 as P,
  {
    sortDirection = SORT_FILTER_DEFAULT_VALUES.sortDirection,
    sortBy = SORT_FILTER_DEFAULT_VALUES.sortBy,
    filters = SORT_FILTER_DEFAULT_VALUES.filters,
  }: Partial<SortFiltersFormValuesNarrowed> = {},
  filterDefinitions: Partial<FilterDefinitions<T>> = {},
): Promise<
  P extends -1 ? GetResourcesResponse<T> : GetResourcesResponsePaginated<T>
> {
  const sort = `${sortDirection === SortDirection.Ascending ? "+" : "-"}${sortBy ?? "order"}`;

  const search = sanitizeFilteredFields(filterDefinitions, filters);
  if (page > 0) {
    search.set("page", String(page));
    search.set("limit", String(LIST_RESULTS_PER_PAGE));
  }
  search.set("sort", sort);

  const searchString = `?${search.toString()}`;

  const result = await fetchQuery<GetResourcesResponsePaginated<T>>(
    searchString,
    {
      resource,
    },
  );
  return result;
}
