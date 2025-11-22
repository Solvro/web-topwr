"use client";

import { useArfSheet } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

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
    <SheetCard
      event={event}
      clickable={clickable}
      parentResourceData={parentResourceData}
      sheet={arfSheet}
      formProps={formProps}
      iconOnly
    >
      <div className="my-auto">
        <div className="mt-1 font-medium">{formattedDescription}</div>
      </div>
    </SheetCard>
  );
}
