import { Calendar } from "@/components/calendar";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/app";

export default function CalendarEventsPage(props: ResourcePageProps) {
  return <Calendar clickable resource={Resource.CalendarEvents} {...props} />;
}
