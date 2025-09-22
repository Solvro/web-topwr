import type * as z from "zod";

import type { RESOURCE_SCHEMAS } from "@/schemas";

export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}

export interface CalendarEvent {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  googleCallId?: string;
}

// API response type from the event_calendar endpoint
export interface ApiCalendarEvent {
  id: string;
  name: string;
  description: string | null;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string | null;
  googleCallId: string | null;
}

export type AddEventFormData = z.infer<
  (typeof RESOURCE_SCHEMAS)["event_calendar"]
>;
