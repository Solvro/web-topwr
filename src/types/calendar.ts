import type { ReactNode } from "react";

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

export interface DetailField<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  getValue: (data: T) => unknown;
  formatter?: (value: unknown) => ReactNode;
  isVisible?: (data: T) => boolean;
  className?: string;
}
