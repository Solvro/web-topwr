"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { fetchResources, getKey, isOrderableResource } from "@/lib/helpers";
import type { GetResourcesResponsePaginated } from "@/types/api";
import type {
  EditableResource,
  OrderableResource,
  ResourceDataType,
} from "@/types/app";
import type { FilterDefinitions, ResourceRelations } from "@/types/components";
import type { SortFiltersFormValuesNarrowed } from "@/types/forms";

import { AbstractResourceListItems } from "./item";
import { OrderableItemWrapper } from "./orderable-item-wrapper";

export function InfiniteScroller<T extends EditableResource>({
  resource,
  initialData,
  filterDefinitions = {},
  sortFilters = {},
  relatedResources,
}: {
  resource: T;
  initialData: GetResourcesResponsePaginated<T>;
  filterDefinitions?: Partial<FilterDefinitions<T>>;
  sortFilters?: Partial<SortFiltersFormValuesNarrowed>;
  relatedResources: ResourceRelations<T>;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        getKey.query.resourceList(resource),
        sortFilters,
        filterDefinitions,
      ],
      queryFn: async ({ pageParam }) =>
        fetchResources(resource, pageParam, sortFilters, filterDefinitions),
      initialPageParam: 1,
      getPreviousPageParam: ({ meta }) =>
        meta.currentPage > meta.firstPage ? meta.currentPage - 1 : undefined,
      getNextPageParam: ({ meta }) =>
        meta.currentPage < meta.lastPage ? meta.currentPage + 1 : undefined,
      initialData: { pageParams: [1], pages: [initialData] },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );

  return (
    <>
      {isOrderableResource(resource) ? (
        <OrderableItemWrapper
          resource={resource}
          relatedResources={
            relatedResources as ResourceRelations<OrderableResource>
          }
          data={flatData as ResourceDataType<OrderableResource>[]}
        />
      ) : (
        <AbstractResourceListItems
          items={flatData}
          resource={resource}
          relatedResources={relatedResources}
        />
      )}
      <div className="mt-4 flex justify-center">
        <Button
          ref={ref}
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage}
          loading={isFetchingNextPage}
          variant="secondary"
        >
          {hasNextPage
            ? "Załaduj więcej"
            : "To już jest koniec, nie ma już nic!"}
        </Button>
      </div>
    </>
  );
}
