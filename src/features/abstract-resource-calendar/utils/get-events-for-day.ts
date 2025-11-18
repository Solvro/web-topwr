import type { DateObject, EventCardType, MappedCalendarData } from "../types/internal";
import { formatDateObject } from "./format-date-object";

export function getEventsForDay(
  dateObject: DateObject,
  events: MappedCalendarData,
): EventCardType[] {
  const formattedDateObject = formatDateObject(dateObject);
  const dayEvents = events.dayEvents[formattedDateObject] ?? [];

  return dayEvents;
}
