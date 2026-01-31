import { format } from "date-fns";

import type { EventCardType, MappedCalendarData } from "../types/internal";

export function getEventsForDay(
  date: Date,
  events: MappedCalendarData,
): EventCardType[] {
  const dayEvents = events.dayEvents[format(date, "yyyy-MM-dd")] ?? [];

  return dayEvents;
}
