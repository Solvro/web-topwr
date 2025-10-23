import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/** used for styling inputs of any kind */
export function InputSlot({
  asChild,
  ...props
}: { asChild?: boolean } & React.HTMLAttributes<HTMLElement>) {
  const Comp = (asChild ?? false) ? Slot.Root : "input";
  return (
    <Comp
      className={cn(
        "bg-background hover:bg-background/20",
        "border-input aria-invalid:border-destructive border",
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus-visible:ring-[3px]",
        "shadow-xs",
      )}
      {...props}
    />
  );
}
