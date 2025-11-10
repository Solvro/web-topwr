import { AbstractResourceEditPage } from "@/components/abstract/resource-edit-page";
import { Resource } from "@/config/enums";
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
