import type { UrlObject } from "node:url";

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { ListSearchParameters } from "./abstract/abstract-resource-list";

export function PaginationComponent({
  page,
  totalPages,
  searchParams,
  //   currentResultsNumber,
  //   resultsNumber,
}: {
  page: number;
  totalPages: number;
  currentResultsNumber: number;
  resultsNumber: number;
  searchParams: ListSearchParameters;
}) {
  const createPageHref = (newPage: number): UrlObject => ({
    query: { ...searchParams, page: String(newPage) },
  });

  return (
    <Pagination className="my-0 flex w-full flex-row items-center justify-center sm:mx-0 sm:w-min sm:justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href={createPageHref(1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? createPageHref(page - 1) : createPageHref(1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {(page === totalPages || page === totalPages - 1) &&
          totalPages >= 5 && (
            <PaginationItem className="hidden sm:inline-flex">
              <PaginationLink
                href={createPageHref(totalPages - 4)}
                isActive={false}
              >
                {totalPages - 4}
              </PaginationLink>
            </PaginationItem>
          )}
        {page === totalPages && totalPages >= 5 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink
              href={createPageHref(totalPages - 3)}
              isActive={false}
            >
              {totalPages - 3}
            </PaginationLink>
          </PaginationItem>
        )}

        {page > 2 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink href={createPageHref(page - 2)} isActive={false}>
              {page - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink href={createPageHref(page - 1)} isActive={false}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={createPageHref(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink href={createPageHref(page + 1)} isActive={false}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages - 1 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink href={createPageHref(page + 2)} isActive={false}>
              {page + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {page === 1 && totalPages >= 5 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink href={createPageHref(4)} isActive={false}>
              {4}
            </PaginationLink>
          </PaginationItem>
        )}
        {(page === 1 || page === 2) && totalPages >= 5 && (
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationLink href={createPageHref(5)} isActive={false}>
              {5}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={
              page < totalPages
                ? createPageHref(page + 1)
                : createPageHref(page)
            }
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href={createPageHref(totalPages)}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>

      {/* <span className="hidden text-xs whitespace-nowrap xl:block">
          {page * currentResultsNumber - 10} - {page * currentResultsNumber} z{" "}
          {resultsNumber} wyników
        </span> */}
    </Pagination>
  );
}
