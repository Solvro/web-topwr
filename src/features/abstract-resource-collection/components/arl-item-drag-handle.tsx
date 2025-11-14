"use client";

import { useSortable } from "@dnd-kit/sortable";
import { GripHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ListItem } from "../types/internal";

export function ArlItemDragHandle({ item }: { item: ListItem }) {
  const { attributes, listeners, isDragging } = useSortable({
    id: item.id,
  });
  return (
    <GripHorizontal
      className={cn("h-full", {
        "cursor-grab": !isDragging,
      })}
      {...attributes}
      {...listeners}
    />
  );
}
