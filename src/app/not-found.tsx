import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";

export default function NotFound() {
  return <ErrorMessage type={ApplicationError.NotFound} />;
}
