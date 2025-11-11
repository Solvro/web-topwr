"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import {
  fetchPaginatedResources,
  getKey,
  isOrderableResource,
} from "@/lib/helpers";
import type { GetResourcesResponsePaginated } from "@/types/api";
import type {
  EditableResource,
  OrderableResource,
  ResourceDataType,
} from "@/types/app";
import type { FilterDefinitions } from "@/types/components";
import type { SortFiltersFormValuesNarrowed } from "@/types/forms";

import { AbstractResourceListItems } from "./item";
import { OrderableItemWrapper } from "./orderable-item-wrapper";

export function InfiniteScroller<T extends EditableResource>({
  resource,
  initialData,
  filterDefinitions = {},
  sortFilters = {},
}: {
  resource: T;
  initialData: GetResourcesResponsePaginated<T>;
  filterDefinitions?: Partial<FilterDefinitions<T>>;
  sortFilters?: Partial<SortFiltersFormValuesNarrowed>;
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
        fetchPaginatedResources(
          resource,
          pageParam,
          sortFilters,
          filterDefinitions,
        ),
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
    <section className="flex flex-col gap-4">
      {isOrderableResource(resource) ? (
        <OrderableItemWrapper
          resource={resource}
          data={flatData as ResourceDataType<OrderableResource>[]}
        />
      ) : (
        <AbstractResourceListItems items={flatData} resource={resource} />
      )}
      <Button
        ref={ref}
        onClick={() => void fetchNextPage()}
        disabled={!hasNextPage}
        loading={isFetchingNextPage}
        variant="secondary"
        className="self-center"
      >
        {hasNextPage ? "Załaduj więcej" : "To już jest koniec, nie ma już nic!"}
      </Button>
    </section>
  );
}
