import type { ReactNode } from "react";

import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDataWithRelations,
  ResourceDefaultValues,
  ResourcePk,
} from "@/features/resources/types";
import type { ResourceFormProps } from "@/types/components";

export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}

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

export type SheetFormProps<T extends Resource> = ResourceFormProps<T> & {
  defaultValues: ResourceDefaultValues<T>;
};
