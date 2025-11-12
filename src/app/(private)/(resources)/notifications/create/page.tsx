import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError, Resource } from "@/config/enums";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateNotificationPage(_: ResourceCreatePageProps) {
  // TODO: Implement notification creation page
  // return <AbstractResourceForm resource={Resource.Notifications} {...props} />;
  return (
    <ErrorMessage
      type={ApplicationError.NotImplemented}
      returnToResource={Resource.Notifications}
    />
  );
}
