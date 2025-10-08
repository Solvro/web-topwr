"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import type { Resource } from "@/config/enums";
import { fetchResources, isOrderableResource } from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type {
  ListSearchParameters,
  OrderableResource,
  ResourceDataType,
} from "@/types/app";

import { AbstractResourceListItems } from "./item";
import { OrderableItemWrapper } from "./orderable-item-wrapper";

export function InfiniteScroller<T extends Resource>({
  resource,
  initialData,
  searchParameters = {},
}: {
  resource: T;
  initialData: GetResourcesResponse<T>;
  searchParameters?: ListSearchParameters;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [`${resource}-list-page`, searchParameters],
      queryFn: async ({ pageParam }) =>
        fetchResources(resource, pageParam, searchParameters),
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
          data={flatData as ResourceDataType<OrderableResource>[]}
        />
      ) : (
        <AbstractResourceListItems items={flatData} resource={resource} />
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
