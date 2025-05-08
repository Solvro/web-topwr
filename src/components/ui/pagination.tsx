import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "./button";

export function Pagiation({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  setPage,
}: {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (pageNumber: number) => void;
}) {
  return (
    <div className="flex flex-row items-center">
      <Button
        onClick={() => {
          setPage(1);
        }}
        variant={"ghost"}
        disabled={!hasPreviousPage}
        className="h-10 w-10"
      >
        <ChevronFirst />
      </Button>
      <Button
        onClick={() => {
          setPage(page - 1);
        }}
        variant={"ghost"}
        disabled={!hasPreviousPage}
        className="h-10 w-10"
      >
        <ChevronLeft />
      </Button>

      {page > 1 ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <span>...</span>
        </div>
      ) : null}

      {hasPreviousPage ? (
        <Button
          onClick={() => {
            setPage(page - 1);
          }}
          variant={"ghost"}
          className="h-10 w-10"
        >
          <span>{page - 1}</span>
        </Button>
      ) : null}

      <Button
        onClick={() => {
          setPage(page);
        }}
        variant={"outline"}
        className="h-10 w-10"
      >
        <span>{page}</span>
      </Button>

      {hasNextPage ? (
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
          variant={"ghost"}
          className="h-10 w-10"
        >
          <span>{page + 1}</span>
        </Button>
      ) : null}

      {page < totalPages - 1 ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <span>...</span>
        </div>
      ) : null}

      <Button
        onClick={() => {
          setPage(page + 1);
        }}
        variant={"ghost"}
        disabled={!hasNextPage}
        className="h-10 w-10"
      >
        <ChevronRight />
      </Button>

      <Button
        onClick={() => {
          setPage(totalPages);
        }}
        variant={"ghost"}
        disabled={!hasNextPage}
        className="h-10 w-10"
      >
        <ChevronLast />
      </Button>
    </div>
  );
}
