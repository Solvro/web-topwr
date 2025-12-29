"use client";

import { useArfSheet } from "@/features/abstract-resource-form";
import type { ArfSheetFormProps } from "@/features/abstract-resource-form/types";
import { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

import { formatDaySwapDescription } from "../utils/format-day-swap-description";
import { SheetCard } from "./arc-sheet-card";

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
    defaultValues: event,
  } satisfies ArfSheetFormProps<Resource.DaySwaps>;

  const formattedDescription = formatDaySwapDescription(
    event.changedWeekday,
    event.changedDayIsEven,
  );

  return (
    <SheetCard
      resource={Resource.DaySwaps}
      event={event}
      clickable={clickable}
      parentResourceData={parentResourceData}
      sheet={arfSheet}
      formProps={formProps}
    >
      <div className="my-auto">
        <div className="mt-1 font-medium">{formattedDescription}</div>
      </div>
    </SheetCard>
  );
}
