import { ErrorMessage } from "@/components/error-message";
import { ApplicationError } from "@/config/enums";

export default function ReviewPage() {
  return <ErrorMessage type={ApplicationError.NotImplemented} />;
}
