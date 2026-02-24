"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  isDragging?: boolean;
  className?: string;
}

export function DragHandle({
  attributes,
  listeners,
  isDragging = false,
  className,
}: DragHandleProps) {
  return (
    <GripHorizontal
      className={cn(
        "h-full shrink-0",
        { "cursor-grab": !isDragging },
        className,
      )}
      {...attributes}
      {...listeners}
    />
  );
}
