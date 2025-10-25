import type { DateObject } from "@/types/calendar";

function getMonthByDate(
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

/** Returns a rounded date string in ISO format.
 * @param hoursAhead Number of hours to add to midnight of the base date (default is the current day).
 * @return ISO string of the rounded date.
 * @example getRoundedDate(8, new Date('2025-01-01')) // Returns 2025-01-01T08:00:00.000Z
 * @example getRoundedDate(24) // Returns tomorrow's date at 00:00:00 (midnight)
 */
export function getRoundedDate(hoursAhead = 0, baseDate?: Date): string {
  const date = new Date(baseDate ?? new Date());
  date.setHours(hoursAhead);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}
