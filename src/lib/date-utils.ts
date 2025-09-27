import type { DateObject } from "@/types/calendar";

export function getCurrentDate(locale = "pl"): DateObject {
  const today = new Date();
  const year = today.getFullYear();
  const monthNumber = today.getMonth() + 1; // Months are zero-indexed
  const monthName = today.toLocaleString(locale, { month: "long" });
  const day = today.getDate();

  return {
    year,
    month: {
      value: monthNumber,
      name: monthName,
      daysInMonth: new Date(year, monthNumber, 0).getDate(),
    },
    day,
  };
}

export function getMonthByNumberAndYear(
  month: number,
  year: number,
  locale = "pl",
): { value: number; name: string; daysInMonth: number } {
  const monthName = new Date(year, month - 1).toLocaleString(locale, {
    month: "long",
  });
  const daysInMonth = new Date(year, month, 0).getDate();

  return {
    value: month,
    name: monthName,
    daysInMonth,
  };
}

export function getFutureDate(hoursAhead: number): Date {
  const now = new Date();
  now.setHours(now.getHours() + hoursAhead);
  now.setMinutes(0, 0, 0);
  return now;
}
