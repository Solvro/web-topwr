import { BackToHomeButton } from "@/components/presentation/back-to-home-button";
import { Calendar } from "@/features/abstract-resource-collection";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function CalendarEventsPage(props: ResourcePageProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <Calendar clickable resource={Resource.CalendarEvents} {...props} />
      <BackToHomeButton chevronsIcon className="self-start" />
    </div>
  );
}
