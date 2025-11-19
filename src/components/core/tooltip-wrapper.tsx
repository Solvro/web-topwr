import type { ComponentProps, ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipWrapper({
  tooltip,
  ...props
}: ComponentProps<typeof TooltipTrigger> & {
  tooltip?: string | null;
}): ReactNode {
  return tooltip == null ? (
    props.children
  ) : (
    <Tooltip>
      <TooltipTrigger asChild {...props} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
