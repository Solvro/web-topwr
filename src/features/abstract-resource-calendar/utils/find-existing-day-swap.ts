import type { SemesterStructure } from "../types/internal";
import { serializeDateDay } from "./serialize-date-day";

export function findExistingDaySwap(
  date: string,
  parentSemester: SemesterStructure,
): boolean {
  const dayKey = serializeDateDay(date);
  const semesterEventsForDay = parentSemester.semesterEvents[dayKey];

  if (semesterEventsForDay == null) {
    return false;
  }

  return semesterEventsForDay.daySwaps.length > 0;
}
