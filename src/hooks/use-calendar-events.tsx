"use client";

import { useEffect, useState } from "react";

import { transformApiEventsToCalendarEvents } from "@/lib/calendar-utils";
import { fetchQuery } from "@/lib/fetch-utils";
import type { ApiCalendarEvent, CalendarEvent } from "@/types/calendar";

interface UseCalendarEventsResult {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export function useCalendarEvents(): UseCalendarEventsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchQuery<{ data: ApiCalendarEvent[] }>(
        "/event_calendar",
      );
      const transformedEvents = transformApiEventsToCalendarEvents(
        response.data,
      );
      setEvents(transformedEvents);
    } catch (error_) {
      console.error("Failed to fetch calendar events:", error_);
      setError(
        error_ instanceof Error ? error_.message : "Failed to fetch events",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
  };
}
