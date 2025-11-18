import type { Resource } from "@/features/resources";
import type { ResourceDataType } from "@/features/resources/types";
import { formatDate, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";


export function formatTime(
  event: ResourceDataType<Resource.CalendarEvents>,
  timeType: "startTime" | "endTime",
) {
  return formatDate(
    event[timeType],
    isSameDay(event.startTime, event.endTime) ? "HH:mm" : "HH:mm (E)",
    { locale: pl },
  );
}
