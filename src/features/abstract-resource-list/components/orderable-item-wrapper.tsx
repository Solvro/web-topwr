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
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { getResourcePkValue } from "@/features/resources";
import type {
  OrderableResource,
  ResourceDataType,
  ResourcePk,
} from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";
import type { ResourceRelations } from "@/types/components";
import { sanitizeId } from "@/utils";

import { calculateNewSortValue } from "../utils/calculate-new-sort-value";
import { ArlItem } from "./arl-item";
import { ArlItems } from "./arl-items";
import { SortableItem } from "./sortable-item";

export function OrderableItemWrapper<T extends OrderableResource>({
  resource,
  relatedResources,
  items: data,
}: {
  resource: T;
  relatedResources: ResourceRelations<T>;
  items: ResourceDataType<T>[];
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
    { id: ResourcePk; order: number }
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
    const activeItem = items.find(
      (item) => getResourcePkValue(resource, item) === activeId,
    );
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
    const order = calculateNewSortValue(items, oldIndex, newIndex);
    toast.promise(
      mutateAsync({ id: getResourcePkValue(resource, getActiveItem()), order }),
      getToastMessages.resource(resource).modify,
    );
  }

  const itemProps = { resource, relatedResources, orderable: true };

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
        <ArlItems<T>
          items={items}
          ItemComponent={SortableItem}
          {...itemProps}
        />
      </SortableContext>
      <DragOverlay>
        {activeId == null ? null : (
          <div className="opacity-80 drop-shadow-xl">
            <ArlItem item={getActiveItem()} {...itemProps} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
