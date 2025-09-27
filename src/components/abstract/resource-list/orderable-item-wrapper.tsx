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

import type { Resource } from "@/config/enums";
import type { ResourceDataType } from "@/types/app";

import { AbstractResourceListItem } from "./item";

interface Sortable {
  id: UniqueIdentifier;
  sort: number;
}

/**
 * Given the indices of an item's old and new position, calculate its new sort value using the average of its neighbours' sort values.
 * TODO: this is for future use when the backend supports sorting, currently unused
 */
export function calculateNewSortValue(
  items: Sortable[],
  oldIndex: number,
  newIndex: number,
): number {
  if (newIndex === 0) {
    return items[0].sort - 1;
  }
  if (newIndex === items.length - 1) {
    // arbitrary large-ish number which facilitates inserting new items, 64 is a power of 2 so easy to halve
    return (items.at(-1)?.sort ?? 63) + 1;
  }
  const first = items[newIndex];
  const second =
    oldIndex < newIndex ? items[newIndex + 1] : items[newIndex - 1];
  return (first.sort + second.sort) / 2;
}

export function OrderableItemWrapper<T extends Resource>({
  resource,
  data,
}: {
  resource: T;
  data: ResourceDataType<T>[];
}) {
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
    let oldIndex = -1;
    let newIndex = -1;
    for (const [index, item] of items.entries()) {
      if (item.id === eventActiveId) {
        oldIndex = index;
        if (newIndex !== -1) {
          break;
        }
      } else if (item.id === overId) {
        newIndex = index;
        if (oldIndex !== -1) {
          break;
        }
      }
    }
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
        <ul>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} resource={resource} />
          ))}
        </ul>
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

function SortableItem<T extends Resource>({
  item,
  resource,
}: {
  item: ResourceDataType<T>;
  resource: T;
}) {
  const { setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style}>
      <AbstractResourceListItem
        ref={setNodeRef}
        item={item}
        resource={resource}
        orderable
      />
    </div>
  );
}
