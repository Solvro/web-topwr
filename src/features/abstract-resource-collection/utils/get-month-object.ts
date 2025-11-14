import { getMonthByDate } from "./get-month-by-date";

export function getMonthObject(
  month: number,
  year: number,
  locale = "pl",
): { value: number; name: string; daysInMonth: number } {
  const date = new Date(year, month - 1);
  return getMonthByDate(date, locale);
}
