"use client";

import { Plus, SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ListItem, Resource } from "@/lib/types";

import { DeleteButtonWithDialog } from "./delete-button-with-dialog";
import { PaginationComponent } from "./pagination";

export function AbstractList({
  resource,
  listItems,
  page,
  totalPages,
  resultsNumber,
}: {
  resource: Resource;
  listItems: ListItem[];
  page: number;
  totalPages: number;
  resultsNumber: number;
}) {
  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex-[1_1_0] space-y-4 overflow-y-auto pr-2">
        {listItems.map((item) => (
          <div
            key={item.id}
            className="bg-background-secondary grid grid-cols-[1fr_auto] items-center gap-x-1 rounded-xl p-4 md:grid-cols-[12rem_1fr_auto] md:gap-x-4 xl:grid-cols-[20rem_1fr_auto]"
          >
            <span className="font-medium md:text-center">{item.name}</span>
            <span className="hidden truncate md:block">
              {item.shortDescription == null ||
              item.shortDescription.trim() === ""
                ? "Brak opisu"
                : item.shortDescription}
            </span>
            <div className="space-x-0.5 sm:space-x-2">
              <Button variant="ghost" className="h-10 w-10" asChild>
                <Link
                  href={`/${resource}/edit/${String(item.id)}`}
                  className=""
                >
                  <SquarePen />
                </Link>
              </Button>

              <DeleteButtonWithDialog resource={resource} id={item.id} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-between gap-y-4 sm:flex-row">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          currentResultsNumber={listItems.length}
          resultsNumber={resultsNumber}
        />

        <Button asChild>
          <Link href={`/${resource}/create`}>
            {resource === "student_organizations"
              ? "Dodaj nową organizację"
              : "Dodaj nowy artykuł"}
            <Plus />
          </Link>
        </Button>
      </div>
    </div>
  );
}
