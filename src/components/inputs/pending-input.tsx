import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PendingInput({
  label,
  message,
  className,
}: {
  label: ReactNode;
  message: ReactNode;
  className?: string;
}) {
  return (
    <Label asChild>
      <div className={cn("flex-col items-stretch", className)}>
        {label}
        <div className="text-foreground/50 grid flex-1 place-items-center py-2">
          {message}
        </div>
      </div>
    </Label>
  );
}
