import { Calendar } from "@/components/calendar";
import { CalendarEventTypes } from "@/config/enums";

export default function CalendarPage() {
  return (
    <Calendar clickable={false} resource={CalendarEventTypes.CalendarEvents} />
  );
}
