import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchResources } from "@/lib/helpers";
import type { RoutableResource } from "@/types/app";
import type { ListSearchParameters } from "@/types/components";
import type { ResourceDeclinableField } from "@/types/polish";

import { BackToHomeButton } from "../back-to-home-button";
import { CreateButton } from "../create-button";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFilters } from "./sort-filters";

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
    <div className="flex h-full flex-col space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="self-start">
            Pokaż filtry <Filter />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mx-4 w-[calc(100vw-2rem)] sm:w-fit">
          <SortFilters
            sortableFields={sortableFields}
            searchableFields={searchableFields}
          />
        </PopoverContent>
      </Popover>
      <div className="w-full grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          searchParameters={await searchParams}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        <BackToHomeButton />
      </div>
    </div>
  );
}
