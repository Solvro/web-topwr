
import { Resource } from "@/features/resources";
import { EventCard } from "../components/arc-event-card";
import type { MappedCalendarData } from "../types/internal";
import { serializeDateDay } from "./serialize-date-day";
import type { ResourceDataType } from "@/features/resources/types";

export function eventCalendarMapper(
  events: ResourceDataType<Resource.CalendarEvents>[],
  clickable: boolean,
): MappedCalendarData {
  const mappedData: MappedCalendarData = {
    dayEvents: {},
    semesters: {},
  };

  for (const event of events) {
    const dayKey = serializeDateDay(event.startTime);

    mappedData.dayEvents[dayKey] ??= [];

    mappedData.dayEvents[dayKey].push(
      <EventCard
        key={event.id}
        event={event}
        resource={Resource.CalendarEvents}
        clickable={clickable}
      />,
    );
  }

  return mappedData;
}
