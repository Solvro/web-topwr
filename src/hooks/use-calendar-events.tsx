"use client";

import { useCallback, useEffect, useState } from "react";

import type { CalendarEventTypes } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { fetchQuery } from "@/lib/fetch-utils";
import type { CalendarEvent } from "@/types/calendar";

interface UseGenericCalendarEventsOptions<TApiEvent> {
  resource?: CalendarEventTypes;
  endpoint?: string;
  transformFunction: (apiEvents: TApiEvent[]) => CalendarEvent[];
}

interface UseGenericCalendarEventsResult {
  events: CalendarEvent[];
  error: string | null;
}

export function useGenericCalendarEvents<TApiEvent>(
  options: UseGenericCalendarEventsOptions<TApiEvent>,
): UseGenericCalendarEventsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);

      let apiPath: string;
      if (options.endpoint != null && options.endpoint !== "") {
        apiPath = options.endpoint;
      } else {
        // Use resource if endpoint is not provided
        if (options.resource === undefined) {
          throw new TypeError("Either endpoint or resource must be provided");
        }
        const resourceMetadata = RESOURCE_METADATA[options.resource];
        apiPath = `/${resourceMetadata.apiPath}`;
      }

      const response = await fetchQuery<{ data: TApiEvent[] }>(apiPath);
      const transformedEvents = options.transformFunction(response.data);
      setEvents(transformedEvents);
    } catch (error_) {
      console.error("Failed to fetch calendar events:", error_);
      setError(
        error_ instanceof Error ? error_.message : "Failed to fetch events",
      );
    }
  }, [options]);

  useEffect(() => {
    void fetchEvents();
  }, []);

  return {
    events,
    error,
  };
}
