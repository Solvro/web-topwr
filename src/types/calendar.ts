import type { ApiCalendarEvent } from "../features/backend/types";

export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}

export type CalendarEvent = Omit<ApiCalendarEvent, "startTime" | "endTime"> & {
  startTime: Date;
  endTime: Date;
};
