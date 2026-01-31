import { format } from "date-fns";

import type { SemesterStructure } from "../types/internal";

export function findExistingDaySwap(
  date: string,
  parentSemester: SemesterStructure,
): boolean {
  const dayKey = format(date, "yyyy-MM-dd");
  const semesterEventsForDay = parentSemester.semesterEvents[dayKey];

  if (semesterEventsForDay == null) {
    return false;
  }

  return semesterEventsForDay.daySwaps.length > 0;
}
