"use client";

import { SquarePen } from "lucide-react";

import { useArfSheet } from "@/features/abstract-resource-form";
import {
  DeleteButtonWithDialog,
  OpenCreateSheetButton,
  Resource,
} from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

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
  const arfSheet = useArfSheet(Resource.AcademicSemesters as Resource);

  const formProps = {
    resource: Resource.DaySwaps,
    className: "w-full px-4",
    ...event,
  } satisfies ResourceFormProps<Resource.DaySwaps> &
    ResourceDefaultValues<Resource.DaySwaps>;

  const formattedDescription = formatDaySwapDescription(
    event.changedWeekday,
    event.changedDayIsEven,
  );

  return (
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      <div className="my-auto">
        <div className="mt-1 font-medium">{formattedDescription}</div>
      </div>
      {clickable ? (
        <div className="flex items-center gap-2">
          <OpenCreateSheetButton
            resource={Resource.DaySwaps}
            parentResourceData={parentResourceData}
            sheet={arfSheet}
            formProps={formProps}
          >
            <SquarePen />
          </OpenCreateSheetButton>
          <DeleteButtonWithDialog
            resource={Resource.DaySwaps}
            itemName={formattedDescription}
            id={event.id}
          />
        </div>
      ) : null}
    </article>
  );
}
