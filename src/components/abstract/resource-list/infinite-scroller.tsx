"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import type { Resource } from "@/config/enums";
import { fetchResources } from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type { ListSearchParameters } from "@/types/app";

import { AbstractResourceListItem } from "./item";
import { OrderableItemWrapper } from "./orderable-item-wrapper";

export function InfiniteScroller<T extends Resource>({
  resource,
  initialData,
  searchParameters = {},
  orderable = false,
}: {
  resource: T;
  initialData: GetResourcesResponse<T>;
  searchParameters?: ListSearchParameters;
  orderable?: boolean;
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
      {orderable ? (
        <OrderableItemWrapper resource={resource} data={flatData} />
      ) : (
        <ul>
          {flatData.map((item) => (
            <AbstractResourceListItem
              key={item.id}
              item={item}
              resource={resource}
            />
          ))}
        </ul>
      )}
      <div className="flex justify-center">
        <Button
          ref={ref}
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage}
          loading={isFetchingNextPage}
        >
          {hasNextPage
            ? "Załaduj więcej"
            : "To już jest koniec, nie ma już nic!"}
        </Button>
      </div>
    </>
  );
}
