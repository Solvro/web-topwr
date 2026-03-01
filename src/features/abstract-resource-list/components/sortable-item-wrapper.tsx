"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, ReactNode } from "react";

import type { DragHandleProps } from "@/components/core/drag-handle";

interface SortableChildrenProps {
  dragHandleProps: Omit<DragHandleProps, "className">;
  style: CSSProperties;
  setNodeRef: (node: HTMLElement | null) => void;
}

export function SortableItemWrapper({
  id,
  render,
}: {
  id: UniqueIdentifier;
  render: (props: SortableChildrenProps) => ReactNode;
}): ReactNode {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandleProps: SortableChildrenProps["dragHandleProps"] = {
    attributes,
    listeners,
    isDragging,
  };

  return render({ dragHandleProps, style, setNodeRef });
}
