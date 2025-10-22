import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/** used for styling inputs of any kind */
export function InputSlot({
  asChild,
  ...props
}: { asChild?: boolean } & React.HTMLAttributes<HTMLElement>) {
  const Comp = asChild ? Slot.Root : "input";
  return (
    <Comp
      className={cn(
        "bg-background hover:bg-background/20",
        "border-input aria-invalid:border-destructive border",
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus-visible:ring-[3px]",
      )}
      {...props}
    />
  );
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputSlot asChild>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden",
          className,
        )}
        {...props}
      />
    </InputSlot>
  );
}

export { Input };
