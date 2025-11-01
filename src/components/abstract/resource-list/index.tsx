import { fetchResources } from "@/lib/helpers";
import type { RoutableResource } from "@/types/app";
import type { ListSearchParameters } from "@/types/components";
import type { ResourceDeclinableField } from "@/types/polish";

import { BackToHomeButton } from "../back-to-home-button";
import { CreateButton } from "../create-button";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFiltersPopover } from "./sort-filters-popover";

export async function AbstractResourceList<T extends RoutableResource>({
  resource,
  searchParams,
  sortableFields = [],
  searchableFields = [],
}: {
  resource: T;
  searchParams: Promise<ListSearchParameters>;
  sortableFields?: ResourceDeclinableField<T>[];
  searchableFields?: ResourceDeclinableField<T>[];
}) {
  const page = 1;

  const firstPageData = await fetchResources(
    resource,
    page,
    await searchParams,
  );

  return (
    <div className="flex h-full flex-col">
      <SortFiltersPopover
        sortableFields={sortableFields}
        searchableFields={searchableFields}
      />
      <div className="w-full grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          searchParameters={await searchParams}
        />
      </div>
      <div className="mt-4 flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        <BackToHomeButton />
      </div>
    </div>
  );
}
