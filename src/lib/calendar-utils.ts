import type { ApiCalendarEvent, CalendarEvent } from "@/types/calendar";

export function transformApiEventToCalendarEvent(
  apiEvent: ApiCalendarEvent,
): CalendarEvent {
  return {
    id: apiEvent.id,
    name: apiEvent.name,
    description: apiEvent.description ?? undefined,
    startTime: new Date(apiEvent.startTime),
    endTime: new Date(apiEvent.endTime),
    location: apiEvent.location ?? undefined,
    googleCallId: apiEvent.googleCallId ?? undefined,
  };
}

export function transformApiEventsToCalendarEvents(
  apiEvents: ApiCalendarEvent[],
): CalendarEvent[] {
  return apiEvents.map((apiEvent) =>
    transformApiEventToCalendarEvent(apiEvent),
  );
}
