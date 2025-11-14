"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { getKey } from "@/features/backend";
import type { GetResourcesResponsePaginated } from "@/features/backend/types";
import { isOrderableResource } from "@/features/resources";
import type {
  EditableResource,
  OrderableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { fetchPaginatedResources } from "../api/fetch-paginated-resources";
import type {
  FilterDefinitions,
  SortFiltersFormValuesNarrowed,
} from "../types/sort-filters";
import { ArlItems } from "./arl-items";
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
        <ArlItems items={flatData} resource={resource} />
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
