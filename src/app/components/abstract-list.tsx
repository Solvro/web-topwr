import { ChevronLeft, Plus, SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DeleteButtonWithDialog } from "./delete-button-with-dialog";
import { PaginationComponent } from "./pagination";

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
    <div className="container mx-auto flex h-full flex-col space-y-5 px-2">
      <div className="flex-[1_1_0] space-y-4 overflow-y-scroll pr-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[8rem_1fr_auto] items-center gap-x-4 rounded-xl bg-[#F7F7F8] p-4 sm:grid-cols-[12rem_1fr_auto] xl:grid-cols-[20rem_1fr_auto]"
          >
            <span className="white text-center font-medium">{item.name}</span>
            <span>
              {item.description == null
                ? "Brak opisu"
                : (() => {
                    const temporaryDiv = document.createElement("div");
                    temporaryDiv.innerHTML = item.description;
                    if (temporaryDiv.textContent == null) {
                      return "Brak opisu";
                    }
                    const sanitized = temporaryDiv.textContent || "";
                    return sanitized.length > 100
                      ? `${sanitized.slice(0, 100)}...`
                      : sanitized;
                  })()}
            </span>
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

              <DeleteButtonWithDialog resource={resource} id={item.id} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between space-y-2 xl:flex-row">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          currentResultsNumber={data.length}
          resultsNumber={resultsNumber}
        />

        <Link href={`/${resource}/create`} passHref className="">
          <Button className="">
            {resource === "student_organizations"
              ? "Dodaj nową organizację"
              : "Dodaj nowy artykuł"}
            <Plus />
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
