import {
  AbstractResourceCalendar,
  eventCalendarMapper,
} from "@/features/abstract-resource-calendar";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function CalendarEventsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceCalendar
      resource={Resource.CalendarEvents}
      dataMapper={eventCalendarMapper}
      clickable
      {...props}
    />
  );
}
