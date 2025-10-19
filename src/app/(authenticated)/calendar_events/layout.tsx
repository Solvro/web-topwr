import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/app";

export default function CalendarEventsLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout resource={Resource.CalendarEvents} {...props} />
  );
}
