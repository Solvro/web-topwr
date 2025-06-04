"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ListItem } from "@/types/app";

export function DragHandle({ item }: { item: ListItem }) {
  const { attributes, listeners, isDragging } = useDraggable({
    id: item.id,
  });
  return (
    <GripHorizontal
      className={cn("mr-2 h-full", {
        "cursor-grab": !isDragging,
      })}
      {...attributes}
      {...listeners}
    />
  );
}
