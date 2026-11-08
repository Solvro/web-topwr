import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function LandingCard({
  className,
  asChild = false,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "border-border relative isolate overflow-hidden rounded-3xl border shadow-[0_16px_32px_-12px] shadow-black/7",
        className,
      )}
      {...props}
    />
  );
}

export { LandingCard };
