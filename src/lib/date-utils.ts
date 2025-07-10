import type { DateObject } from "./types";

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
