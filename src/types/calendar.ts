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
