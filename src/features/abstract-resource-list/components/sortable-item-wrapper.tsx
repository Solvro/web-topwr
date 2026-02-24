"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, ReactNode } from "react";

import type { DragHandleProps } from "@/components/core/drag-handle";

export interface SortableChildrenProps {
  dragHandleProps: Omit<DragHandleProps, "className">;
  style: CSSProperties;
  setNodeRef: (node: HTMLElement | null) => void;
}

interface SortableItemWrapperProps {
  id: UniqueIdentifier;
  children: (props: SortableChildrenProps) => ReactNode;
}

export function SortableItemWrapper({
  id,
  children,
}: SortableItemWrapperProps): ReactNode {
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

  return children({ dragHandleProps, style, setNodeRef });
}
