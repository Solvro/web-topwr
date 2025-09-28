import { BookOpenText, Calendar, Pin } from "lucide-react";
import type { ReactNode } from "react";

import type { CalendarEvent, DetailField } from "@/types/calendar";

import { CalendarEventTypes } from "./enums";

/**
 * Date formatting functions for calendar events
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTimeRange = (startTime: Date, endTime: Date): ReactNode => {
  return (
    <div>
      <div>{formatDate(startTime)}</div>
      <div>
        {formatTime(startTime)} - {formatTime(endTime)}
      </div>
    </div>
  );
};

/**
 * Helper function to check if a value is a non-empty string
 */
const hasValue = (value: unknown): boolean => {
  return value != null && typeof value === "string" && value.trim() !== "";
};

/**
 * Calendar event metadata configuration
 * Similar to RESOURCE_METADATA but for calendar event details modal
 */
export const CALENDAR_EVENT_METADATA: Record<
  CalendarEventTypes,
  {
    title: (eventData: CalendarEvent) => string;
    description: string;
    fields: DetailField<CalendarEvent>[];
  }
> = {
  [CalendarEventTypes.CalendarEvents]: {
    title: (eventData: CalendarEvent): string => eventData.name,
    description: "Szczegóły wydarzenia",
    fields: [
      {
        key: "dateTime",
        label: "Data i godzina",
        icon: <Calendar />,
        getValue: (event: CalendarEvent) => ({
          startTime: event.startTime,
          endTime: event.endTime,
        }),
        formatter: (value: unknown): ReactNode => {
          const { startTime, endTime } = value as {
            startTime: Date;
            endTime: Date;
          };
          return formatDateTimeRange(startTime, endTime);
        },
      },
      {
        key: "location",
        label: "Miejsce",
        icon: <Pin />,
        getValue: (event: CalendarEvent) => event.location,
        isVisible: (event: CalendarEvent) => hasValue(event.location),
      },
      {
        key: "description",
        label: "Opis",
        icon: <BookOpenText />,
        getValue: (event: CalendarEvent) => event.description,
        isVisible: (event: CalendarEvent) => hasValue(event.description),
      },
    ],
  },
};
