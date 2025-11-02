"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { fetchResources, getKey, isOrderableResource } from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type {
  OrderableResource,
  ResourceDataType,
  RoutableResource,
} from "@/types/app";

import { AbstractResourceListItems } from "./item";
import { OrderableItemWrapper } from "./orderable-item-wrapper";

export function InfiniteScroller<T extends RoutableResource>({
  resource,
  initialData,
  searchParameters = {},
}: {
  resource: T;
  initialData: GetResourcesResponse<T>;
  searchParameters?: Record<string, string | undefined>;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [getKey.query.resourceList(resource), searchParameters],
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
