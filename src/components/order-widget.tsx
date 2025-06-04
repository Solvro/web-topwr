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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import type { ListItem, Resource } from "@/lib/types";

import { AbstractListItem } from "./abstract-list";

export function OrderableItemWrapper({
  items: initialItems,
  resource,
}: {
  items: ListItem[];
  resource: Resource;
}) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function getActiveItem() {
    const activeItem = items.find((item) => item.id === activeId);
    if (activeItem == null) {
      throw new Error("Active item not found in the list");
    }
    return activeItem;
  }

  function updateItemOrder(
    eventActiveId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    const ids: UniqueIdentifier[] = items.map((item) => item.id);
    const oldIndex = ids.indexOf(eventActiveId);
    const newIndex = overId == null ? -1 : ids.indexOf(overId);
    const newItems = arrayMove(items, oldIndex, newIndex);
    // TODO: update the items on the backend
    // currently this is only updated on the client side
    setItems(newItems);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        setActiveId(event.active.id);
      }}
      onDragEnd={(event) => {
        if (event.active.id !== event.over?.id) {
          updateItemOrder(event.active.id, event.over?.id);
        }
        setActiveId(null);
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} item={item} resource={resource} />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId == null ? null : (
          <div className="opacity-80 drop-shadow-xl">
            <AbstractListItem
              item={getActiveItem()}
              resource={resource}
              orderable
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function SortableItem({
  item,
  resource,
}: {
  item: ListItem;
  resource: Resource;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AbstractListItem item={item} resource={resource} orderable />
    </div>
  );
}
