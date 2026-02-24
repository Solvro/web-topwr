"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getResourcePkValue } from "@/features/resources";
import type {
  OrderableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import { ArlItem } from "./arl-item";
import { ArlItems } from "./arl-items";
import { SortableItem } from "./sortable-item";

export interface ReorderEvent {
  id: UniqueIdentifier;
  oldIndex: number;
  newIndex: number;
}

interface OrderableItemWrapperProps<T extends OrderableResource> {
  resource: T;
  relatedResources: ResourceRelations<T>;
  items: ResourceDataType<T>[];
  onReorder: (event: ReorderEvent) => void;
  onReorderError?: () => void;
  contextId?: string;
  renderDragOverlay?: (activeItem: ResourceDataType<T>) => ReactNode;
}

export function OrderableItemWrapper<T extends OrderableResource>({
  resource,
  relatedResources,
  items: data,
  onReorder,
  onReorderError,
  contextId,
  renderDragOverlay,
}: OrderableItemWrapperProps<T>) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<ResourceDataType<T>[]>(data);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(data);
  }, [data]);

  function getActiveItem() {
    const activeItem = items.find(
      (item) => getResourcePkValue(resource, item) === activeId,
    );
    if (activeItem == null) {
      throw new Error("Active item not found in the list");
    }
    return activeItem;
  }

  function handleDragEnd(
    eventActiveId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    let oldIndex = -1;
    let newIndex = -1;
    for (const [index, item] of items.entries()) {
      const itemId = getResourcePkValue(resource, item);
      if (itemId === eventActiveId) {
        oldIndex = index;
        if (newIndex !== -1) {
          break;
        }
      } else if (itemId === overId) {
        newIndex = index;
        if (oldIndex !== -1) {
          break;
        }
      }
    }
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      onReorder({ id: eventActiveId, oldIndex, newIndex });
    } catch {
      setItems(data);
      onReorderError?.();
    }
  }

  const itemProps = { resource, relatedResources };

  const defaultRenderDragOverlay = (activeItem: ResourceDataType<T>) => (
    <div className="opacity-80 drop-shadow-xl">
      <ArlItem item={activeItem} {...itemProps} />
    </div>
  );

  return (
    <DndContext
      id={contextId ?? `dnd-context-${resource}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        document.body.style.cursor = "grabbing";
        setActiveId(event.active.id);
      }}
      onDragEnd={(event) => {
        if (event.active.id !== event.over?.id) {
          handleDragEnd(event.active.id, event.over?.id);
        }
        document.body.style.cursor = "auto";
        setActiveId(null);
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ArlItems<T>
          items={items}
          ItemComponent={SortableItem}
          {...itemProps}
        />
      </SortableContext>
      <DragOverlay>
        {activeId == null
          ? null
          : (renderDragOverlay ?? defaultRenderDragOverlay)(getActiveItem())}
      </DragOverlay>
    </DndContext>
  );
}
