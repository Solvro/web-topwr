import { AppLayout } from "@/components/presentation/app-layout";
import { ErrorMessage } from "@/components/presentation/error-message";
import { ApplicationError } from "@/config/enums";

export default function NotFound() {
  return (
    <AppLayout>
      <ErrorMessage type={ApplicationError.NotFound} />
    </AppLayout>
  );
}
