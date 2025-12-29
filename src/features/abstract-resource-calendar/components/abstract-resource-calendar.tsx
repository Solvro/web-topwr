import type { ReactNode } from "react";

import { fetchResources } from "@/features/backend";
import type { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

import type {
  CalendarDataMapper,
  ResourceCalendarProps,
} from "../types/internal";
import { AbstractResourceCalendarClient } from "./arc-client";

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
    <AbstractResourceCalendarClient
      resource={resource}
      searchParams={await searchParams}
      mappedData={mappedData}
      clickable={clickable}
      {...props}
    >
      {children}
    </AbstractResourceCalendarClient>
  );
}
