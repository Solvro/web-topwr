"use client";

import { SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResourceFormProps } from "@/types/components";
import { DeleteButtonWithDialog, Resource } from "@/features/resources";
import { useArfSheet } from "@/features/abstract-resource-form";
import type { ResourceDataType } from "@/features/resources/types";

export function HolidayEventCard({
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
  } satisfies ResourceFormProps<Resource.Holidays>;
  return (
    <>
      <div className="my-auto">
        <div className="font-medium">{event.description}</div>
        <div className="mt-1 text-xs">{event.startDate}</div>
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
                  childResource: Resource.Holidays,
                  parentResourceData,
                },
                formProps,
              );
            }}
          >
            <SquarePen />
          </Button>
          <DeleteButtonWithDialog
            resource={Resource.Holidays}
            itemName={event.description}
            id={event.id}
          />
        </div>
      ) : null}
    </>
  );
}
