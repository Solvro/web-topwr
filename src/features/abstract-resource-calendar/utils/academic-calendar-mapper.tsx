import { Resource } from "@/features/resources";
import type { ResourceDataWithRelations } from "@/features/resources/types";

import { AcademicSemesterCard } from "../components/arc-academic-semester-card";
import { DaySwapCard } from "../components/arc-day-swap-card";
import { HolidayCard } from "../components/arc-holiday-card";
import type { MappedCalendarData } from "../types/internal";
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

    mappedData.semesters[semester.id] = {
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
      for (
        let currentDate = new Date(startDate);
        currentDate.getTime() <= lastDate.getTime();
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        dayKeys.push(serializeDateDay(currentDate.toISOString()));
      }

      const holidayCard = (
        <HolidayCard
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

      mappedData.semesters[semester.id].semesterEvents.holidays.push(
        holidayCard,
      );
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
      mappedData.semesters[semester.id].semesterEvents.daySwaps.push(
        daySwapCard,
      );
    }
  }
  return mappedData;
}
