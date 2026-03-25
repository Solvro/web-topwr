import { RotateCcw } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

interface ArfResetButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "onClick"
> {
  onResetForm?: () => void;
}

export function ArfResetButton({ onResetForm, ...props }: ArfResetButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onResetForm} {...props}>
      Resetuj formularz <RotateCcw />
    </Button>
  );
}
