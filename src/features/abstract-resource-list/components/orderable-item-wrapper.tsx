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
import { useEffect, useRef, useState } from "react";

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
  const dragStartIndex = useRef<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(data);
  }, [data]);

  const itemIds = items.map((item) => getResourcePkValue(resource, item));

  function getItemIndex(id: UniqueIdentifier) {
    return itemIds.indexOf(id as string);
  }

  function getActiveItem() {
    const activeItem = items.find(
      (item) => getResourcePkValue(resource, item) === activeId,
    );
    if (activeItem == null) {
      throw new Error("Active item not found in the list");
    }
    return activeItem;
  }

  function handleDragOver(
    activeIdParameter: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    if (overId == null || activeIdParameter === overId) {
      return;
    }
    const oldIndex = getItemIndex(activeIdParameter);
    const newIndex = getItemIndex(overId);
    if (oldIndex !== -1 && newIndex !== -1) {
      setItems((current) => arrayMove(current, oldIndex, newIndex));
    }
  }

  function handleDragEnd(
    eventActiveId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    const oldIndex = dragStartIndex.current;
    const newIndex = getItemIndex(eventActiveId);

    if (oldIndex == null || overId == null || oldIndex === newIndex) {
      return;
    }

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
        dragStartIndex.current = getItemIndex(event.active.id);
      }}
      onDragOver={(event) => {
        handleDragOver(event.active.id, event.over?.id);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event.active.id, event.over?.id);
        document.body.style.cursor = "auto";
        setActiveId(null);
        dragStartIndex.current = null;
      }}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
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
