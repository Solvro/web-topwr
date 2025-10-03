import { ChevronsLeft, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { fetchResources } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type {
  ListSearchParameters,
  ResourceDeclinableField,
} from "@/types/app";

import { InfiniteScroller } from "./infinite-scroller";
import { SortFilters } from "./sort-filters";

export async function AbstractResourceList<T extends Resource>({
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

  const resourceAccusative = declineNoun(resource, {
    case: DeclensionCase.Accusative,
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      <SortFilters
        sortableFields={sortableFields}
        searchableFields={searchableFields}
      />
      <div className="w-full grow basis-[0] space-y-4 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          searchParameters={await searchParams}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <Button asChild>
          <Link href={`/${resource}/create`}>
            Dodaj {resourceAccusative}
            <Plus />
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary w-min"
          asChild
        >
          <Link href="/" className="">
            <ChevronsLeft />
            Wróć na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
