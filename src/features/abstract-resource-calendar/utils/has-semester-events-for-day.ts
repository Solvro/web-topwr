import type { DayKey, MappedCalendarData } from "../types/internal";
import { findParentSemesterForDate } from "./find-parent-semester-for-date";

export function hasSemesterEventsForDay(
  clickedDay: DayKey,
  mappedData: MappedCalendarData,
): boolean {
  const parentSemester = findParentSemesterForDate(clickedDay, mappedData);

  if (parentSemester === null) {
    return false;
  }
  return true;
}
