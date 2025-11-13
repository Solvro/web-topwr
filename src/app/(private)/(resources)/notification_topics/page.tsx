import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";
import { CreateButton, Resource } from "@/features/resources";
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
