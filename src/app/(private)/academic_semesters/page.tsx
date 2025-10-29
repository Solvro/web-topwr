import { BackToHomeButton } from "@/components/abstract/back-to-home-button";
import { Calendar } from "@/components/calendar";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function CalendarEventsPage(props: ResourcePageProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <Calendar clickable resource={Resource.AcademicSemesters} {...props} />
      <BackToHomeButton />
    </div>
  );
}
