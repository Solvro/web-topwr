import type { DateObject } from "@/types/calendar";

export function getMonthByDate(
  date: Date,
  locale = "pl",
): { value: number; name: string; daysInMonth: number } {
  const monthNumber = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthName = date.toLocaleString(locale, { month: "long" });
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  return {
    value: monthNumber,
    name: monthName,
    daysInMonth,
  };
}

export function getCurrentDate(locale = "pl"): DateObject {
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate();

  return {
    year,
    month: getMonthByDate(today, locale),
    day,
  };
}

export function getMonthByNumberAndYear(
  month: number,
  year: number,
  locale = "pl",
): { value: number; name: string; daysInMonth: number } {
  const date = new Date(year, month - 1);
  return getMonthByDate(date, locale);
}

export function getFutureDate(hoursAhead: number): string {
  const now = new Date();
  now.setHours(now.getHours() + hoursAhead);
  now.setMinutes(0, 0, 0);
  return now.toISOString();
}

export function serializeDate(dateObject: DateObject): string {
  return `${dateObject.year.toString()}-${dateObject.month.value.toString().padStart(2, "0")}-${dateObject.day.toString().padStart(2, "0")}`;
}
