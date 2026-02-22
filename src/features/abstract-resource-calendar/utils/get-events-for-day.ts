import type { EventCardType, MappedCalendarData } from "../types/internal";
import { formatDateKey } from "./format-date-key";

export function getEventsForDay(
  date: Date,
  events: MappedCalendarData,
): EventCardType[] {
  const dayEvents = events.dayEvents[formatDateKey(date)] ?? [];

  return dayEvents;
}
