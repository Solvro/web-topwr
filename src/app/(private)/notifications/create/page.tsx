import { ErrorMessage } from "@/components/error-message";
import { ApplicationError, Resource } from "@/config/enums";

export default function CreateNotificationPage() {
  // TODO: Implement notification creation page
  return (
    <ErrorMessage
      type={ApplicationError.NotImplemented}
      returnToResource={Resource.Notifications}
    />
  );
}
