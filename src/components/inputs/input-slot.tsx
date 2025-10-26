import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

/** Wrapper for any component that applies consistent "input-like" styling. */
export function InputSlot<T extends ElementType>({
  renderAs: Comp,
  className,
  ...props
}: {
  renderAs: T;
  className?: string;
} & ComponentProps<T>) {
  return (
    <Comp
      className={cn(
        "bg-background transition-colors",
        "placeholder:text-muted-foreground selection:text-primary-foreground file:text-foreground selection:bg-primary",
        "border-input aria-invalid:border-destructive focus-visible:border-ring border",
        "focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus-visible:ring-[3px]",
        "shadow-xs",
        className as string,
      )}
      {...props}
    />
  );
}
