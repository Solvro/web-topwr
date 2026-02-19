import type { SemesterStructure } from "../types/internal";
import { formatDateKey } from "./format-date-key";

export function findExistingDaySwap(
  date: string,
  parentSemester: SemesterStructure,
): boolean {
  const dayKey = formatDateKey(new Date(date));
  const semesterEventsForDay = parentSemester.semesterEvents[dayKey];

  if (semesterEventsForDay == null) {
    return false;
  }

  return semesterEventsForDay.daySwaps.length > 0;
}
