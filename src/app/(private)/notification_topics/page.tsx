import { CreateButton } from "@/components/abstract/create-button";
import { ErrorMessage } from "@/components/error-message";
import { ApplicationError, Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function NotificationTopicsPage(_props: ResourcePageProps) {
  return (
    <div className="flex h-full flex-col">
      <ErrorMessage
        type={ApplicationError.NotImplemented}
        returnToResource={Resource.Notifications}
      />
      <CreateButton
        resource={Resource.NotificationTopics}
        className="self-end"
      />
    </div>
  );
}
