"use client";

import { formatDate } from "date-fns";
import { pl } from "date-fns/locale";

import type { Resource } from "@/features/resources";
import { DeleteButtonWithDialog, EditButton } from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { ArcHideButtonWithDialog } from "./arc-hide-button-with-dialog";

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
    <article
      key={event.id}
      className="bg-accent flex w-full justify-between rounded-md p-3 text-left text-sm"
      title={event.description ?? ""}
    >
      <header>
        <p className="font-medium">{event.name}</p>
        <p className="mt-1 text-xs">
          {event.startTime === event.endTime ? (
            formatDate(event.startTime, "HH:mm", { locale: pl })
          ) : (
            <>
              {formatDate(event.startTime, "EEEE HH:mm", { locale: pl })}
              {" — "}
              {formatDate(event.endTime, "EEEE HH:mm", { locale: pl })}
            </>
          )}
        </p>
      </header>
      {clickable ? (
        <footer className="flex items-center">
          {event.googleCalId == null ? null : (
            <ArcHideButtonWithDialog
              resource={resource as EditableResource}
              googleCalId={event.googleCalId}
              hidden={event.hidden}
            />
          )}
          <EditButton resource={resource as EditableResource} id={event.id} />
          <DeleteButtonWithDialog
            resource={resource}
            itemName={event.name}
            id={event.id}
          />
        </footer>
      ) : null}
    </article>
  );
}
