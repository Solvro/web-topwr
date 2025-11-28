"use client";

import { useArfSheet } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

import type { SheetFormProps } from "../types/internal";
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
    defaultValues: event,
  } satisfies SheetFormProps<Resource.Holidays>;

  return (
    <SheetCard
      resource={Resource.Holidays}
      event={event}
      clickable={clickable}
      parentResourceData={parentResourceData}
      sheet={arfSheet}
      formProps={formProps}
    >
      <div className="my-auto">
        <div className="font-medium">{event.description}</div>
        <div className="mt-1 text-xs">{event.startDate}</div>
      </div>
    </SheetCard>
  );
}
