import type { Resource } from "@/features/resources";
import type { ResourceDataType, ResourceDataWithRelations } from "@/features/resources/types";
import type { ReactNode } from "react";


export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}

export type DayKey = string;
export type SemesterId = number;
export type EventCardType = ReactNode;

export interface SemesterEvents {
  daySwaps: EventCardType[];
  holidays: EventCardType[];
}
export interface SemesterStructure {
  semester: ResourceDataType<Resource.AcademicSemesters>;
  semesterCard: ReactNode;
  semesterEvents: SemesterEvents;
}

export interface MappedCalendarData {
  dayEvents: Record<DayKey, EventCardType[]>;
  semesters: Record<SemesterId, SemesterStructure>;
}

export type CalendarDataMapper<T extends Resource> = (
  events: ResourceDataWithRelations<T>[],
  clickable: boolean,
) => MappedCalendarData;

export interface CalendarModalContextValue {
  openSemesters: () => void;
}
