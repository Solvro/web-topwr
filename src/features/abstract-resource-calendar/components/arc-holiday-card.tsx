"use client";

import { SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useArfSheet } from "@/features/abstract-resource-form";
import { DeleteButtonWithDialog, Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDefaultValues,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

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
    ...event,
  } satisfies ResourceFormProps<Resource.Holidays> &
    ResourceDefaultValues<Resource.Holidays>;
  return (
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
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
    </article>
  );
}
