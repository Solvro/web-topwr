"use client";

import { useSortable } from "@dnd-kit/sortable";
import { GripHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ListItem } from "@/types/app";

export function DragHandle({ item }: { item: ListItem }) {
  const { attributes, listeners, isDragging } = useSortable({
    id: item.id,
  });
  return (
    <GripHorizontal
      className={cn("h-full outline-none", {
        "cursor-grab": !isDragging,
      })}
      {...attributes}
      {...listeners}
    />
  );
}
