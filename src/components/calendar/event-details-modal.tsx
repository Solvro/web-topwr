import { AbstractDetailsModal } from "@/components/abstract/abstract-details-modal";
import { CALENDAR_EVENT_METADATA } from "@/config/calendar-events";
import type { CalendarEventTypes } from "@/config/enums";
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  resource: CalendarEventTypes;
}

export function EventDetailsModal({
  isOpen,
  onOpenChange,
  event,
  resource,
}: Props) {
  const metadata =
    CALENDAR_EVENT_METADATA[resource as keyof typeof CALENDAR_EVENT_METADATA];

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
