import type { Resource } from "@/config/enums";

import type { DatedResource, GetResourceWithRelationsResponse } from "./api";
import type { ResourceDataType, RoutableResource } from "./app";

export type CalendarEventTypes = "holiday" | "daySwap";

export interface DateObject {
  year: number;
  month: {
    value: number;
    name: string;
    daysInMonth: number;
  };
  day: number;
}

export interface CalendarEvent {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  googleCallId?: string;
}

export type AcademicCalendarEvent<
  T extends Resource,
  L extends CalendarEventTypes,
> = DatedResource &
  ResourceDataType<T> & {
    __type: L;
    __parentSemester: GetResourceWithRelationsResponse<T>["data"];
  } & { id: number };

export type UnspecifiedEventType<
  T extends Resource,
  L extends CalendarEventTypes,
> = AcademicCalendarEvent<T, L> | ResourceDataType<RoutableResource>;
