import type { MappedCalendarData, SemesterStructure } from "../types/internal";

export function findParentSemesterForDate(
  clickedDay: string,
  mappedData: MappedCalendarData,
): SemesterStructure | null {
  const clickedDate = new Date(clickedDay);

  for (const semesterStructure of Object.values(mappedData.semesters)) {
    const semesterStartDate = new Date(
      semesterStructure.semester.semesterStartDate,
    );
    const examSessionLastDate = new Date(
      semesterStructure.semester.examSessionLastDate,
    );

    if (
      clickedDate >= semesterStartDate &&
      clickedDate <= examSessionLastDate
    ) {
      return semesterStructure;
    }
  }

  return null;
}
