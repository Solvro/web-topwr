import { format } from "date-fns";

import type { Resource } from "@/features/resources";
import type { ResourceDataWithRelations } from "@/features/resources/types";

import { AcademicSemesterCard } from "../components/arc-academic-semester-card";
import { DaySwapCard } from "../components/arc-day-swap-card";
import { HolidayCard } from "../components/arc-holiday-card";
import type { MappedCalendarData } from "../types/internal";

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
      />
    );

    mappedData.semesters[semester.id] = {
      semester,
      semesterCard,
      semesterEvents: {},
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
        dayKeys.push(format(currentDate.toISOString(), "yyyy-MM-dd"));
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

        // Add to semester events for this specific day
        mappedData.semesters[semester.id].semesterEvents[dayKey] ??= {
          daySwaps: [],
          holidays: [],
        };
        mappedData.semesters[semester.id].semesterEvents[dayKey]?.holidays.push(
          holidayCard,
        );
      }
    }

    for (const daySwap of daySwaps) {
      const dayKey = format(daySwap.date, "yyyy-MM-dd");

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

      // Add to semester events for this specific day
      mappedData.semesters[semester.id].semesterEvents[dayKey] ??= {
        daySwaps: [],
        holidays: [],
      };
      mappedData.semesters[semester.id].semesterEvents[dayKey]?.daySwaps.push(
        daySwapCard,
      );
    }
  }
  return mappedData;
}
