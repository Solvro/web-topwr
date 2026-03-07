import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { ResourceLayoutProps } from "@/types/components";

export default function NotificationHistoryLayout(props: ResourceLayoutProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.NotificationEntries}
      {...props}
    />
  );
}
