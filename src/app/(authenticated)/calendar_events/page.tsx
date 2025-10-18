import { Calendar } from "@/components/calendar";
import { Resource } from "@/config/enums";

export default function CalendarPage() {
  return <Calendar clickable resource={Resource.CalendarEvents} />;
}
