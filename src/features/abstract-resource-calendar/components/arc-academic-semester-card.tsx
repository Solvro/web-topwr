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
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      <section className="my-auto">
        <p className="font-medium">{semester.name}</p>
        <p className="mt-1 text-xs">
          {serializeDateDay(semester.semesterStartDate)} -{" "}
          {serializeDateDay(semester.examSessionLastDate)}
        </p>
      </section>
      {clickable ? (
        <section className="flex items-center">
          <EditButton
            resource={resource as EditableResource}
            id={semester.id}
          />
          <DeleteButtonWithDialog
            resource={resource}
            itemName={semester.name}
            id={semester.id}
          />
        </section>
      ) : null}
    </article>
  );
}
