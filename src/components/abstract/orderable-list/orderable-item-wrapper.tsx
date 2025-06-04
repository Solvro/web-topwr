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
import { useEffect, useState } from "react";

import { AbstractResourceListItem } from "@/components/abstract/abstract-resource-list";
import type { Resource } from "@/config/enums";
import type { ListItem } from "@/types/app";

export function OrderableItemWrapper({
  items: initialItems,
  resource,
}: {
  items: ListItem[];
  resource: Resource;
}) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    // update each time the base items change, e.g. when switching pages
    setItems(initialItems);
  }, [initialItems]);

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
        document.body.style.cursor = "grabbing";
        setActiveId(event.active.id);
      }}
      onDragEnd={(event) => {
        if (event.active.id !== event.over?.id) {
          updateItemOrder(event.active.id, event.over?.id);
        }
        document.body.style.cursor = "default";
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
            <AbstractResourceListItem
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
  const { setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AbstractResourceListItem item={item} resource={resource} orderable />
    </div>
  );
}
