"use client";

import { formatDate } from "date-fns";
import { pl } from "date-fns/locale";

import { useArfSheet } from "@/features/abstract-resource-form";
import type { ArfSheetFormProps } from "@/features/abstract-resource-form/types";
import { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

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
  const arfSheet = useArfSheet(Resource.AcademicSemesters);

  const formProps = {
    resource: Resource.Holidays,
    className: "w-full px-4",
    defaultValues: event,
  } satisfies ArfSheetFormProps<Resource.Holidays>;

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
        {event.startDate === event.lastDate ? (
          <>{formatDate(event.startDate, "dd MMMM yyyy", { locale: pl })}</>
        ) : (
          <>
            {formatDate(event.startDate, "dd MMMM yyyy", { locale: pl })}
            {" — "}
            {formatDate(event.lastDate, "dd MMMM yyyy", { locale: pl })}
          </>
        )}
      </div>
    </SheetCard>
  );
}
