"use client";

import type { Resource } from "@/features/resources";
import { DeleteButtonWithDialog, EditButton } from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { serializeDateDay } from "../utils/serialize-date-day";

export function AcademicSemesterCard({
  semester,
  clickable,
  resource,
}: {
  semester: ResourceDataType<Resource.AcademicSemesters>;
  clickable: boolean;
  resource: Resource;
}) {
  return (
    <div className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      <div className="my-auto">
        <div className="font-medium">{semester.name}</div>
        <div className="mt-1 text-xs">
          {serializeDateDay(semester.semesterStartDate)} -{" "}
          {serializeDateDay(semester.examSessionLastDate)}
        </div>
      </div>
      {clickable ? (
        <div className="flex items-center">
          <EditButton
            resource={resource as EditableResource}
            id={semester.id}
          />
          <DeleteButtonWithDialog
            resource={resource}
            itemName={semester.name}
            id={semester.id}
          />
        </div>
      ) : null}
    </div>
  );
}
