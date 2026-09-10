import type { ReactNode } from "react";

import { getAuthStateServer } from "@/features/authentication/server";
import { fetchResources } from "@/features/backend";
import type { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

import { HIDDEN_EVENT_QUERY_PARAMS } from "../constants";
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
  const authState = await getAuthStateServer();
  const isSolvroAdmin =
    authState?.user.roles.some((role) => role.slug === "solvro_admin") ?? false;
  const resourceData = await fetchResources(
    resource,
    true,
    isSolvroAdmin ? HIDDEN_EVENT_QUERY_PARAMS : undefined,
  );

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
