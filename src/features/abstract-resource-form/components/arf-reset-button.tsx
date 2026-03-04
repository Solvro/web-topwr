import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ResetButton({
  disabled,
  onResetForm,
}: {
  disabled: boolean;
  onResetForm?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onResetForm}
      disabled={disabled}
    >
      Resetuj formularz <RotateCcw />
    </Button>
  );
}
