import { ErrorMessage } from "@/components/error-message";
import { ApplicationError } from "@/config/enums";

export default function ForbiddenPage() {
  return <ErrorMessage type={ApplicationError.Forbidden} />;
}
