import { Plus, SquarePen } from "lucide-react";
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
  data: {
    id: number;
    name?: string;
    title?: string;
    shortDesc?: string | null;
    description?: string | null;
  }[];
  page: number;
  totalPages: number;
  resultsNumber: number;
}) {
  return (
    <div className="flex h-full flex-col space-y-5">
      <div className="flex-[1_1_0] space-y-4 overflow-y-auto pr-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-background-secondary grid grid-cols-[8rem_1fr_auto] items-center gap-x-4 rounded-xl p-4 sm:grid-cols-[12rem_1fr_auto] xl:grid-cols-[20rem_1fr_auto]"
          >
            <span className="text-center font-medium">
              {item.name ?? item.title}
            </span>
            <span>
              {(() => {
                let desc: string;
                if (item.shortDesc != null && item.shortDesc.trim() !== "") {
                  desc = item.shortDesc;
                } else if (
                  item.description != null &&
                  item.description.trim() !== ""
                ) {
                  const temporaryDiv = document.createElement("div");
                  temporaryDiv.innerHTML = item.description ?? "";
                  desc = temporaryDiv.textContent ?? "";
                } else {
                  desc = "";
                }

                if (!desc || desc.trim() === "") {
                  return "Brak opisu";
                }

                return desc.length > 75 ? `${desc.slice(0, 75)}...` : desc;
              })()}
            </span>
            <div className="space-x-2">
              <Button variant={"ghost"} className="h-10 w-10" asChild>
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
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          currentResultsNumber={data.length}
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
