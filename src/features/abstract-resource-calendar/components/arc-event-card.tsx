"use client"

import type { Resource } from "@/features/resources";
import { DeleteButtonWithDialog, EditButton } from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { formatTime } from "../utils/format-time";

export function EventCard({
  event,
  resource,
  clickable,
}: {
  event: ResourceDataType<Resource.CalendarEvents>;
  resource: Resource;
  clickable: boolean;
}) {
  return (
    <div
      key={event.id}
      className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm"
      title={event.description ?? ""}
    >
      <div>
        <div className="font-medium">{event.name}</div>
        <div className="mt-1 text-xs">
          {formatTime(event, "startTime")}
          {event.startTime === event.endTime ? (
            ""
          ) : (
            <>—{formatTime(event, "endTime")}</>
          )}
        </div>
      </div>
      {clickable ? (
        <div className="flex items-center">
          <EditButton resource={resource as EditableResource} id={event.id} />
          <DeleteButtonWithDialog
            resource={resource}
            itemName={event.name}
            id={event.id}
          />
        </div>
      ) : null}
    </div>
  );
}
