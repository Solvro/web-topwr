import type { ReactNode } from "react";

import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDataWithRelations,
  ResourcePk,
} from "@/features/resources/types";

export interface ResourceCalendarProps<T extends Resource> {
  resource: T;
}

export type DayKey = string;
export type EventCardType = ReactNode;

export interface SemesterEvents {
  daySwaps: EventCardType[];
  holidays: EventCardType[];
}
export interface SemesterStructure {
  semester: ResourceDataType<Resource.AcademicSemesters>;
  semesterCard: ReactNode;
  semesterEvents: Partial<Record<DayKey, SemesterEvents>>;
}

export interface MappedCalendarData {
  dayEvents: Record<DayKey, EventCardType[]>;
  semesters: Record<ResourcePk, SemesterStructure>;
}

export type CalendarDataMapper<T extends Resource> = (
  events: ResourceDataWithRelations<T>[],
  clickable: boolean,
) => MappedCalendarData;

export interface CalendarModalContextValue {
  openSemesters: () => void;
}
