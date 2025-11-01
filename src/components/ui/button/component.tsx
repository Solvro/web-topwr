import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { buttonVariants } from "./variants";

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  hideChildrenOnLoading = false,
  children,
  tooltip,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    hideChildrenOnLoading?: boolean;
    tooltip?: string;
  }) {
  const Comp = asChild ? Slot : "button";

  const content = (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      aria-label={tooltip ?? undefined}
      {...props}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <span className="inline-flex gap-1">
          <Spinner className="size-4" />
          {!hideChildrenOnLoading && children}
        </span>
      ) : (
        children
      )}
    </Comp>
  );

  return tooltip == null ? (
    content
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
