"use client";

import { format } from "date-fns";

import {
  DeleteButtonWithDialog,
  EditButton,
  Resource,
} from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

export function AcademicSemesterCard({
  semester,
  clickable,
}: {
  semester: ResourceDataType<Resource.AcademicSemesters>;
  clickable: boolean;
}) {
  return (
    <article className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm">
      <section className="my-auto">
        <p className="font-medium">{semester.name}</p>
        <p className="mt-1 text-xs">
          {format(new Date(semester.semesterStartDate), "yyyy-MM-dd")} –{" "}
          {format(semester.examSessionLastDate, "yyyy-MM-dd")}
        </p>
      </section>
      {clickable ? (
        <section className="flex items-center">
          <EditButton resource={Resource.AcademicSemesters} id={semester.id} />
          <DeleteButtonWithDialog
            resource={Resource.AcademicSemesters}
            itemName={semester.name}
            id={semester.id}
          />
        </section>
      ) : null}
    </article>
  );
}
