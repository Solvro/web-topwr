"use client";

import { SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResourceFormProps } from "@/types/components";
import { DeleteButtonWithDialog, Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";
import { useArfSheet } from "@/features/abstract-resource-form";
import { formatDaySwapDescription } from "../utils/format-day-swap-description";

export function DaySwapCard({
  event,
  clickable,
  parentResourceData,
}: {
  event: ResourceDataType<Resource.DaySwaps>;
  clickable: boolean;
  parentResourceData: ResourceDataType<Resource.AcademicSemesters>;
}) {
  const arfSheet = useArfSheet(Resource.AcademicSemesters);

  const formProps = {
    resource: Resource.DaySwaps,
    className: "w-full px-4",
  } satisfies ResourceFormProps<Resource.DaySwaps>;

  const formattedDescription = formatDaySwapDescription(
    event.changedWeekday,
    event.changedDayIsEven,
  );

  return (
    <>
      <div className="my-auto">
        <div className="text-xs">
          {event.changedDayIsEven ? "Parzysty" : "Nieparzysty"}
        </div>
        <div className="mt-1 font-medium">{formattedDescription}</div>
      </div>
      {clickable ? (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10"
            onClick={() => {
              arfSheet.showSheet(
                {
                  item: null,
                  childResource: Resource.DaySwaps,
                  parentResourceData,
                },
                formProps,
              );
            }}
          >
            <SquarePen />
          </Button>
          <DeleteButtonWithDialog
            resource={Resource.DaySwaps}
            itemName={formattedDescription}
            id={event.id}
          />
        </div>
      ) : null}
    </>
  );
}
