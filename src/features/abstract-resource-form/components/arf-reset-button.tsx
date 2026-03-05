import { RotateCcw } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

interface ResetButtonProps
  extends Omit<ComponentProps<typeof Button>, "onClick"> {
  onResetForm?: () => void;
}

export function ResetButton({ onResetForm, ...props }: ResetButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onResetForm} {...props}>
      Resetuj formularz <RotateCcw />
    </Button>
  );
}
