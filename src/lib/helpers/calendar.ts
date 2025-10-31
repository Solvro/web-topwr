import { formatDate, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

import type { Resource } from "@/config/enums";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { CreatableResource, ResourceDataType } from "@/types/app";
import type { DateObject } from "@/types/calendar";

export function createDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return createDateOnly(date1).getTime() === createDateOnly(date2).getTime();
}

export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean {
  const dateOnly = createDateOnly(date);
  const startOnly = createDateOnly(startDate);
  const endOnly = createDateOnly(endDate);
  return dateOnly >= startOnly && dateOnly <= endOnly;
}

export function formatSingleDate(date: Date): string {
  return formatDate(date, "d MMMM yyyy", { locale: pl });
}

export function formatHolidayDateRange(startDate: Date, endDate: Date): string {
  if (isSameDate(startDate, endDate)) {
    return formatSingleDate(startDate);
  }

  const startString = formatDate(startDate, "d MMMM", { locale: pl });
  const endString = formatSingleDate(endDate);
  return `${startString} - ${endString}`;
}

export function formatDaySwapEventName(date: Date): string {
  return `Zamiana zajęć - ${formatDate(date, "d MMMM yyyy", { locale: pl })}`;
}

export function extractStartDate(
  event: ResourceDataType<CreatableResource>,
): Date | null {
  const startFields = [
    "startTime",
    "startDate",
    "semesterStartDate",
    "visibleFrom",
    "start",
    "date",
    "beginDate",
  ];

  for (const field of startFields) {
    const value = event[field as keyof ResourceDataType<CreatableResource>];
    try {
      if (typeof value === "string") {
        return parseISO(value);
      }
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function extractEndDate(
  event: ResourceDataType<CreatableResource>,
): Date | null {
  const endFields = [
    "endTime",
    "endDate",
    "examSessionLastDate",
    "visibleUntil",
    "end",
    "endDate",
    "finishDate",
  ];

  for (const field of endFields) {
    const value = event[field as keyof ResourceDataType<CreatableResource>];
    try {
      if (typeof value === "string") {
        return parseISO(value);
      }
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export function extractEventName(
  event: ResourceDataType<CreatableResource>,
): string {
  const nameFields = ["name", "title", "summary", "eventName"];

  for (const field of nameFields) {
    const value = event[field as keyof ResourceDataType<CreatableResource>];
    if (typeof value === "string") {
      return value.trim();
    }
  }

  return "";
}

export function extractEventDescription(
  event: ResourceDataType<CreatableResource>,
): string | undefined {
  const descFields = ["description", "details", "notes", "content", "summary"];

  for (const field of descFields) {
    const value = event[field as keyof ResourceDataType<CreatableResource>];
    if (typeof value === "string") {
      return value.trim();
    }
  }

  return undefined;
}

function isAcademicSemesterWithDaySwaps(
  semester: ResourceDataType<CreatableResource>,
): boolean {
  return (
    typeof semester === "object" &&
    "daySwaps" in semester &&
    Array.isArray((semester as { daySwaps: unknown }).daySwaps)
  );
}

function isAcademicSemesterWithHolidays(
  semester: ResourceDataType<CreatableResource>,
): boolean {
  return (
    typeof semester === "object" &&
    "holidays" in semester &&
    Array.isArray((semester as { holidays: unknown }).holidays)
  );
}

export function checkAcademicSemesterEvents(
  semester: GetResourceWithRelationsResponse<CreatableResource>["data"],
  targetDate: Date,
): { hasDaySwap: boolean; hasHoliday: boolean } {
  let hasDaySwap = false;
  let hasHoliday = false;

  if (isAcademicSemesterWithDaySwaps(semester)) {
    for (const daySwap of semester.daySwaps) {
      const daySwapDate = parseISO(daySwap.date);
      if (isSameDate(targetDate, daySwapDate)) {
        hasDaySwap = true;
        break;
      }
    }
  }

  if (isAcademicSemesterWithHolidays(semester)) {
    for (const holiday of semester.holidays) {
      const holidayStartDate = parseISO(holiday.startDate);
      let holidayEndDate = holidayStartDate;

      if (holiday.lastDate) {
        holidayEndDate = parseISO(holiday.lastDate);
      }

      if (isDateInRange(targetDate, holidayStartDate, holidayEndDate)) {
        hasHoliday = true;
        break;
      }
    }
  }

  return { hasDaySwap, hasHoliday };
}

export type DaySpecificEvent<T extends CreatableResource> =
  | (ResourceDataType<Resource.DaySwaps> & {
      __type: "daySwap";
      __parentSemester: GetResourceWithRelationsResponse<T>["data"];
    })
  | (ResourceDataType<Resource.Holidays> & {
      __type: "holiday";
      __parentSemester: GetResourceWithRelationsResponse<T>["data"];
    });

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
 * @example getRoundedDate(8, new Date('2025-01-01')) // Returns 2025-01-01T08:00:00
 * @example getRoundedDate(24) // Returns tomorrow's date at 00:00:00 (midnight)
 */
export function getRoundedDate(hoursAhead = 0, baseDate?: Date): string {
  const date = new Date(baseDate ?? new Date());
  date.setHours(hoursAhead);
  date.setMinutes(0, 0, 0);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
