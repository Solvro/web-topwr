import {
  AbstractResourceCalendar,
  AcademicSemesterListButton,
  academicCalendarMapper,
} from "@/features/abstract-resource-calendar";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DaySwapsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceCalendar
      resource={Resource.AcademicSemesters}
      dataMapper={academicCalendarMapper}
      clickable
      {...props}
    >
      <AcademicSemesterListButton />
    </AbstractResourceCalendar>
  );
}
