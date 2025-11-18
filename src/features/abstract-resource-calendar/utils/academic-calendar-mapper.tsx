import { Resource } from "@/features/resources";
import type { ResourceDataWithRelations } from "@/features/resources/types";

import { AcademicSemesterCard } from "../components/arc-academic-semester-card";
import { DaySwapCard } from "../components/arc-day-swap-card";
import { HolidayEventCard } from "../components/arc-holiday-event-card";
import type { MappedCalendarData, SemesterId } from "../types/internal";
import { serializeDateDay } from "./serialize-date-day";

export function academicCalendarMapper(
  semesters: ResourceDataWithRelations<Resource.AcademicSemesters>[],
  clickable: boolean,
): MappedCalendarData {
  const mappedData: MappedCalendarData = {
    dayEvents: {},
    semesters: {},
  };

  for (const semester of semesters) {
    const semesterCard = (
      <AcademicSemesterCard
        key={semester.id}
        semester={semester}
        clickable={clickable}
        resource={Resource.AcademicSemesters}
      />
    );

    mappedData.semesters[semester.id as SemesterId] = {
      semester,
      semesterCard,
      semesterEvents: {
        daySwaps: [],
        holidays: [],
      },
    };

    const { holidays, daySwaps } = semester;

    for (const holiday of holidays) {
      const startDate = new Date(holiday.startDate);
      const lastDate = new Date(holiday.lastDate);

      const dayKeys: string[] = [];
      const currentDate = new Date(startDate);

      while (currentDate.getTime() <= lastDate.getTime()) {
        dayKeys.push(serializeDateDay(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const holidayCard = (
        <HolidayEventCard
          key={holiday.id}
          event={holiday}
          clickable={clickable}
          parentResourceData={semester}
        />
      );

      for (const dayKey of dayKeys) {
        mappedData.dayEvents[dayKey] ??= [];
        mappedData.dayEvents[dayKey].push(holidayCard);
      }

      mappedData.semesters[
        semester.id as SemesterId
      ].semesterEvents.holidays.push(holidayCard);
    }

    for (const daySwap of daySwaps) {
      const dayKey = serializeDateDay(daySwap.date);

      mappedData.dayEvents[dayKey] ??= [];

      const daySwapCard = (
        <DaySwapCard
          key={daySwap.id}
          event={daySwap}
          clickable={clickable}
          parentResourceData={semester}
        />
      );

      mappedData.dayEvents[dayKey].push(daySwapCard);
      mappedData.semesters[
        semester.id as SemesterId
      ].semesterEvents.daySwaps.push(daySwapCard);
    }
  }

  return mappedData;
}
