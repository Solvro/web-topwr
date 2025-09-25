import { AbstractDetailsModal } from "@/components/abstract/abstract-details-modal";
import { CALENDAR_EVENT_METADATA } from "@/config/calendar-events";
import type { CalendarEventTypes, Resource } from "@/config/enums";
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  resource: Resource;
}

export function EventDetailsModal({
  isOpen,
  onOpenChange,
  event,
  resource,
}: Props) {
  if (
    !((resource as unknown as CalendarEventTypes) in CALENDAR_EVENT_METADATA)
  ) {
    console.error(`No metadata found for resource: ${resource}`);
    return null;
  }
  const metadata =
    CALENDAR_EVENT_METADATA[resource as unknown as CalendarEventTypes];

  return (
    <AbstractDetailsModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      data={event}
      title={metadata.title}
      description={metadata.description}
      fields={metadata.fields}
    />
  );
}
