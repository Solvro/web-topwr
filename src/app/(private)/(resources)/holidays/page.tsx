import {
  AbstractResourceCalendar,
  AcademicSemesterListButton,
  academicCalendarMapper,
} from "@/features/abstract-resource-calendar";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function HolidaysPage(props: ResourcePageProps) {
  return (
    <AbstractResourceCalendar
      resource={Resource.AcademicSemesters}
      dataMapper={academicCalendarMapper}
      clickable={true}
      {...props}
    >
      <AcademicSemesterListButton />
    </AbstractResourceCalendar>
  );
}
