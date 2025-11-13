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
import { toast } from "sonner";

import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import type {
  EditableResource,
  Id,
  OrderableResource,
  ResourceDataType,
} from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";
import { sanitizeId } from "@/utils";

import { AbstractResourceListItems, ArlItem } from "./arl-item";

/**
 * Given the indices of an item's old and new position, calculate its new sort value using the average of its neighbours' sort values.
 */
function calculateNewSortValue(
  items: ResourceDataType<OrderableResource>[],
  oldIndex: number,
  newIndex: number,
): number {
  if (newIndex === 0) {
    return items[0].order - 1;
  }
  if (newIndex === items.length - 1) {
    // arbitrary large-ish number which facilitates inserting new items, 64 is a power of 2 so easy to halve
    const lastItem = items.at(-1);
    return lastItem == null ? 64 : lastItem.order + 1;
  }
  const first = items[newIndex];
  const second =
    oldIndex < newIndex ? items[newIndex + 1] : items[newIndex - 1];
  return (first.order + second.order) / 2;
}

export function OrderableItemWrapper<T extends OrderableResource>({
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

  const { mutateAsync } = useMutationWrapper<
    unknown,
    { id: Id; order: number }
  >(
    `update__${resource}__order`,
    async ({ id, order }) => {
      const response = await fetchMutation<ModifyResourceResponse<T>>(
        sanitizeId(id),
        {
          body: { order },
          resource,
          method: "PATCH",
        },
      );
      return response;
    },
    {
      onError: () => {
        // revert the change
        setItems(data);
      },
    },
  );

  useEffect(() => {
    // TODO: check if there is a better way to do this
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
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
    setItems(newItems);
    const order = calculateNewSortValue(items, oldIndex, newIndex);
    toast.promise(
      mutateAsync({ id: getActiveItem().id, order }),
      getToastMessages.resource(resource).modify,
    );
  }

  return (
    <DndContext
      id={`dnd-context-${resource}`}
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
        document.body.style.cursor = "auto";
        setActiveId(null);
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <AbstractResourceListItems
          items={items}
          resource={resource}
          orderable
          ItemComponent={SortableItem}
        />
      </SortableContext>
      <DragOverlay>
        {activeId == null ? null : (
          <div className="opacity-80 drop-shadow-xl">
            <ArlItem item={getActiveItem()} resource={resource} orderable />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function SortableItem<T extends EditableResource>({
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
      <ArlItem ref={setNodeRef} item={item} resource={resource} orderable />
    </div>
  );
}
