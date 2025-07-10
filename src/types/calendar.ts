export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}