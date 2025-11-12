import { BackToHomeButton } from "@/components/abstract/back-to-home-button";
import { CreateButton } from "@/components/abstract/create-button";
import { Counter } from "@/components/counter";
import { ReturnButton } from "@/components/return-button";
import type {
  CreatableResource,
  EditableResource,
  RoutableResource,
} from "@/types/app";
import type { SearchParameters } from "@/types/components";
import type { ResourceDeclinableField } from "@/types/polish";

import { deserializeSortFilters } from "../lib/deserialize-sort-filters";
import { fetchPaginatedResources } from "../lib/fetch-paginated-resources";
import { getResourceFilterDefinitions } from "../lib/get-resource-filter-definitions";
import { parseSortParameter } from "../lib/parse-sort-parameter";
import type { SortFiltersFormValuesNarrowed } from "../types/internal";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFiltersPopover } from "./sort-filters-popover";

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
    filters: deserializeSortFilters(searchParameters, filterDefinitions),
  };

  const firstPageData = await fetchPaginatedResources(
    resource,
    1,
    sortFilters,
    filterDefinitions,
  );

  return (
    <section className="flex h-full flex-col gap-2">
      <header className="relative w-fit">
        <SortFiltersPopover
          sortableFields={sortableFields}
          filterDefinitions={filterDefinitions}
          defaultValues={sortFilters}
        />
        <Counter
          values={sortFilters.filters ?? []}
          label="Liczba zastosowanych filtrów"
        />
      </header>
      <div className="grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          filterDefinitions={filterDefinitions}
          sortFilters={sortFilters}
        />
      </div>
      <footer className="mt-2 flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        {parentResource == null ? (
          <BackToHomeButton chevronsIcon />
        ) : (
          <ReturnButton resource={parentResource} />
        )}
      </footer>
    </section>
  );
}
