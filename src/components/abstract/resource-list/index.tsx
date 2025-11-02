import { getResourceFilterDefinitions } from "@/lib/filter-definitions";
import {
  fetchResources,
  parseFilterSearchParameters,
  parseSortParameter,
} from "@/lib/helpers";
import type { RoutableResource } from "@/types/app";
import type { SortFiltersFormValuesNarrowed } from "@/types/forms";
import type { ResourceDeclinableField } from "@/types/polish";

import { BackToHomeButton } from "../back-to-home-button";
import { CreateButton } from "../create-button";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFiltersPopover } from "./sort-filters/sort-filters-popover";

export async function AbstractResourceList<T extends RoutableResource>({
  resource,
  searchParams,
  sortableFields = [],
}: {
  resource: T;
  sortableFields?: ResourceDeclinableField<T>[];
  searchParams: Promise<Record<string, string | undefined>>;
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

  const firstPageData = await fetchResources(
    resource,
    1,
    sortFilters,
    filterDefinitions,
  );

  return (
    <div className="flex h-full flex-col">
      <SortFiltersPopover
        sortableFields={sortableFields}
        filterDefinitions={filterDefinitions}
        defaultValues={sortFilters}
      />
      <div className="w-full grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          filterDefinitions={filterDefinitions}
          sortFilters={sortFilters}
        />
      </div>
      <div className="mt-4 flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        <BackToHomeButton />
      </div>
    </div>
  );
}
