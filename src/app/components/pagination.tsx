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

export function PaginationComponent({
  page,
  totalPages,
  //   currentResultsNumber,
  //   resultsNumber,
}: {
  page: number;
  totalPages: number;
  currentResultsNumber: number;
  resultsNumber: number;
}) {
  return (
    <Pagination className="flex w-min flex-row items-center justify-start sm:mx-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href={`?page=1`}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? `?page=${String(page - 1)}` : "/"}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {(page === totalPages || page === totalPages - 1) &&
          totalPages >= 5 && (
            <PaginationItem>
              <PaginationLink
                href={`?page=${String(totalPages - 4)}`}
                isActive={false}
              >
                {totalPages - 4}
              </PaginationLink>
            </PaginationItem>
          )}
        {page === totalPages && totalPages >= 5 && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${String(totalPages - 3)}`}
              isActive={false}
            >
              {totalPages - 3}
            </PaginationLink>
          </PaginationItem>
        )}

        {page > 2 && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(page - 1)}`} isActive={false}>
              {page - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(page - 1)}`} isActive={false}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={`?page=${String(page)}`} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(page + 1)}`} isActive={false}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(page + 2)}`} isActive={false}>
              {page + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {page === 1 && totalPages >= 5 && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(4)}`} isActive={false}>
              {4}
            </PaginationLink>
          </PaginationItem>
        )}
        {(page === 1 || page === 2) && totalPages >= 5 && (
          <PaginationItem>
            <PaginationLink href={`?page=${String(5)}`} isActive={false}>
              {5}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? `?page=${String(page + 1)}` : "/"}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href={`?page=${String(totalPages)}`}
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
