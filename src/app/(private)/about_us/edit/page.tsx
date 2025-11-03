import { ErrorMessage } from "@/components/error-message";
import { ApplicationError, Resource } from "@/config/enums";

export default function EditAboutUsPage() {
  return (
    <ErrorMessage
      type={ApplicationError.NotImplemented}
      returnToResource={Resource.AboutUs}
    />
  );
}
