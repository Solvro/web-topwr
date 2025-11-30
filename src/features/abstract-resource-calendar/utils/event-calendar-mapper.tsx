import { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";

import { EventCard } from "../components/arc-event-card";
import type { MappedCalendarData } from "../types/internal";
import { serializeDateDay } from "./serialize-date-day";

export function eventCalendarMapper(
  events: ResourceDataType<Resource.CalendarEvents>[],
  clickable: boolean,
): MappedCalendarData {
  const mappedData: MappedCalendarData = {
    dayEvents: {},
    semesters: {},
  };

  for (const event of events) {
    const startDate = new Date(event.startTime);
    const lastDate = new Date(event.endTime);

    const dayKeys: string[] = [];
    for (
      let currentDate = new Date(startDate);
      currentDate.getTime() <= lastDate.getTime();
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dayKeys.push(serializeDateDay(currentDate.toISOString()));
    }

    const eventCard = (
      <EventCard
        key={event.id}
        event={event}
        resource={Resource.CalendarEvents}
        clickable={clickable}
      />
    );

    for (const dayKey of dayKeys) {
      mappedData.dayEvents[dayKey] ??= [];
      mappedData.dayEvents[dayKey].push(eventCard);
    }
  }

  return mappedData;
}
