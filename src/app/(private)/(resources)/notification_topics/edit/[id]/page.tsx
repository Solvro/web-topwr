import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditNotificationTopicPage(
  props: ResourceEditPageProps,
) {
  return (
    <AbstractResourceEditPage
      resource={Resource.NotificationTopics}
      {...props}
    />
  );
}
