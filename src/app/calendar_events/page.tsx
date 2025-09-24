import { Calendar } from "@/components/calendar/calendar";
import { Resource } from "@/config/enums";

export default function CalendarPage() {
  return <Calendar clickable={false} resource={Resource.CalendarEvents} />;
}
