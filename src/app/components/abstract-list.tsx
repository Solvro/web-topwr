import { ChevronLeft, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function AbstractList({
  resource,
  data,
  page,
  totalPages,
  resultsNumber,
}: {
  resource: string;
  data: { id: number; name: string; description?: string | null }[];
  page: number;
  totalPages: number;
  resultsNumber: number;
}) {
  return (
    <div className="container mx-auto flex h-full flex-col space-y-5">
      <div className="flex-[1_1_0] space-y-4 overflow-y-scroll pr-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[200px_1fr_auto] items-center gap-x-4 rounded-xl bg-[#F7F7F8] p-4"
          >
            <span className="font-medium">{item.name}</span>
            <span>{item.description ?? "no description"}</span>
            <div className="space-x-2">
              <Link
                href={`/${resource}/edit/${String(item.id)}`}
                passHref
                className=""
              >
                <Button variant={"ghost"} className="h-10 w-10">
                  <SquarePen />
                </Button>
              </Link>
              <Button variant={"ghost"} className="h-10 w-10 text-red-500">
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          currentResultsNumber={data.length}
          resultsNumber={resultsNumber}
        />

        <Link href={`/${resource}/create`} passHref className="">
          <Button className="">
            Dodaj nowy artykuł <Plus />
          </Button>
        </Link>
      </div>
      <Link href="/" passHref className="">
        <Button variant={"ghost"} className="text-primary">
          <ChevronLeft />
          Wroć na stronę główną
        </Button>
      </Link>
    </div>
  );
}

function PaginationComponent({
  page,
  totalPages,
  currentResultsNumber,
  resultsNumber,
}: {
  page: number;
  totalPages: number;
  currentResultsNumber: number;
  resultsNumber: number;
}) {
  return (
    <Pagination className="mx-0 flex w-min flex-row items-center justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? `?page=${String(page - 1)}` : "#"}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* <PaginationItem>
          <PaginationLink href="/">1</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? `?page=${String(page + 1)}` : "#"}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>

      <span className="text-xs whitespace-nowrap">
        Showing {currentResultsNumber} of {resultsNumber} results
      </span>
    </Pagination>
  );
}
