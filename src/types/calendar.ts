import type { ApiCalendarEvent } from "./api";

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
