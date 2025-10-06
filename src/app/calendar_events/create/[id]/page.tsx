import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function EditCalendarEventPage() {
  return <AbstractResourceForm resource={Resource.CalendarEvents} />;
}
