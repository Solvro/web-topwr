import { Counter } from "@/components/counter";
import { ReturnButton } from "@/components/return-button";
import { getResourceFilterDefinitions } from "@/lib/filter-definitions";
import {
  fetchPaginatedResources,
  parseFilterSearchParameters,
  parseSortParameter,
} from "@/lib/helpers";
import type {
  CreatableResource,
  EditableResource,
  RoutableResource,
} from "@/types/app";
import type { SearchParameters } from "@/types/components";
import type { SortFiltersFormValuesNarrowed } from "@/types/forms";
import type { ResourceDeclinableField } from "@/types/polish";

import { BackToHomeButton } from "../back-to-home-button";
import { CreateButton } from "../create-button";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFiltersPopover } from "./sort-filters/sort-filters-popover";

export async function AbstractResourceList<
  T extends CreatableResource & EditableResource,
>({
  resource,
  searchParams,
  sortableFields = [],
  parentResource,
}: {
  resource: T;
  sortableFields?: ResourceDeclinableField<T>[];
  searchParams: Promise<SearchParameters>;
  parentResource?: RoutableResource;
}) {
  const searchParameters = await searchParams;

  const filterDefinitions = await getResourceFilterDefinitions({
    resource,
    includeRelations: true,
  });
  const sortFilters: Partial<SortFiltersFormValuesNarrowed> = {
    ...parseSortParameter(searchParameters.sort, sortableFields),
    filters: parseFilterSearchParameters(searchParameters, filterDefinitions),
  };

  const firstPageData = await fetchPaginatedResources(
    resource,
    1,
    sortFilters,
    filterDefinitions,
  );

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="relative w-fit">
        <SortFiltersPopover
          sortableFields={sortableFields}
          filterDefinitions={filterDefinitions}
          defaultValues={sortFilters}
        />
        <Counter
          values={sortFilters.filters ?? []}
          label="Liczba zastosowanych filtrów"
        />
      </div>
      <div className="w-full grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          filterDefinitions={filterDefinitions}
          sortFilters={sortFilters}
        />
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        {parentResource == null ? (
          <BackToHomeButton chevronsIcon />
        ) : (
          <ReturnButton resource={parentResource} />
        )}
      </div>
    </div>
  );
}
