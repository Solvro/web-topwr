"use client";

import { useArfSheet } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

import { SheetCard } from "./arc-sheet-card";

export function HolidayCard({
  event,
  clickable,
  parentResourceData,
}: {
  event: ResourceDataType<Resource.Holidays>;
  clickable: boolean;
  parentResourceData: ResourceDataType<Resource.AcademicSemesters>;
}) {
  const arfSheet = useArfSheet(Resource.AcademicSemesters as Resource);

  const formProps = {
    resource: Resource.Holidays,
    className: "w-full px-4",
    ...event,
  } satisfies ResourceFormProps<Resource.Holidays> &
    ResourceDefaultValues<Resource.Holidays>;

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
        <div className="font-medium">{event.description}</div>
        <div className="mt-1 text-xs">{event.startDate}</div>
      </div>
    </SheetCard>
  );
}
