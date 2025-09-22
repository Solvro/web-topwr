export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface DaySwap {
  id: number;
  academicCalendarId: number;
  date: string;
  changedWeekday: Weekday;
  changedDayIsEven: boolean;
}
