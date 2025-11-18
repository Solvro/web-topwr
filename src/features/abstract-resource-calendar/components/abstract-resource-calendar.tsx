import type { ReactNode } from "react";

import type {
  ResourceCalendarProps,
  ResourcePageProps,
} from "@/types/components";

import type { CalendarDataMapper } from "../types/internal";
import { AbstractResourceCalendarInternal } from "./arc-client";
import type { Resource } from "@/features/resources";
import { fetchResources } from "@/features/backend";

export async function AbstractResourceCalendar<T extends Resource>({
  resource,
  searchParams,
  dataMapper,
  children,
  clickable,
  ...props
}: ResourceCalendarProps<T> &
  ResourcePageProps & {
    children?: ReactNode;
    dataMapper: CalendarDataMapper<T>;
    clickable: boolean;
  }) {
  const resourceData = await fetchResources(resource, true);

  const mappedData = dataMapper(resourceData, clickable);
  return (
    <AbstractResourceCalendarInternal
      resource={resource}
      searchParams={await searchParams}
      mappedData={mappedData}
      clickable={clickable}
      {...props}
    >
      {children}
    </AbstractResourceCalendarInternal>
  );
}
