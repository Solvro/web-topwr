import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeedbackFormSuccessProps {
  onBackToForm: () => void;
}

export function FeedbackFormSuccess({
  onBackToForm,
}: FeedbackFormSuccessProps) {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-foreground text-3xl leading-tight font-normal sm:text-4xl">
        Dziękujemy za zgłoszenie!
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Twoja opinia trafiła już do zespołu ToPWR. Jeśli zostawiłeś adres
        e-mail, odezwiemy się, gdy tylko przeanalizujemy Twoje zgłoszenie.
      </p>
      <Button
        type="button"
        onClick={onBackToForm}
        className="shadow-primary/20 mt-5 h-11 rounded-full px-5 shadow-lg"
      >
        <ArrowLeft aria-hidden="true" />
        Wróć do formularza
      </Button>
    </div>
  );
}
