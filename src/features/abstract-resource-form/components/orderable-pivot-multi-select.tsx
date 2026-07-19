"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";

import { MultiSelect } from "@/components/ui/multi-select";
import { calculateNewSortValue } from "@/features/abstract-resource-list";
import type { Resource } from "@/features/resources";
import type {
  OrderableResource,
  PivotDataDefinition,
  ResourceDataType,
  ResourcePk,
  ResourceRelation,
} from "@/features/resources/types";

import { usePivotRelationOrderMutation } from "../hooks/use-pivot-relation-order-mutation";
import { getItemPivotOrder, hasMeta } from "../utils/get-item-pivot-order";

export function OrderablePivotMultiSelect<
  T extends Resource,
  L extends ResourceRelation<T>,
>({
  resource,
  resourceRelation,
  endpoint,
  pivotData,
  items,
  multiSelectProps,
}: {
  resource: T;
  resourceRelation: L;
  endpoint: string;
  pivotData: PivotDataDefinition;
  items: ResourceDataType<L>[];
  multiSelectProps: ComponentProps<typeof MultiSelect>;
}) {
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const { mutateOrder } = usePivotRelationOrderMutation({
    resource,
    resourceRelation,
    endpoint,
  });

  const handleReorder = (id: string, oldIndex: number, newIndex: number) => {
    const mappedItems = itemsRef.current.map((item) => ({
      ...item,
      order: getItemPivotOrder(item) ?? 0,
    })) as ResourceDataType<OrderableResource>[];

    const order = calculateNewSortValue(mappedItems, oldIndex, newIndex);

    const originalItem = itemsRef.current.find(
      (item) => String(item.id) === id,
    );
    if (originalItem == null) {
      return;
    }

    const meta = hasMeta(originalItem) ? originalItem.meta : undefined;
    const pivotKey = `pivot_${pivotData.field}`;
    const pivotValue = meta?.[pivotKey];

    if (pivotValue == null) {
      return;
    }

    const reorderedItems = arrayMove(itemsRef.current, oldIndex, newIndex);

    itemsRef.current = reorderedItems.map((item) => {
      if (String(item.id) === id) {
        return {
          ...item,
          meta: {
            ...(hasMeta(item) ? item.meta : {}),
            pivot_order: order,
          },
        };
      }
      return item;
    });

    void mutateOrder(id as ResourcePk, order, {
      [pivotData.field]: pivotValue,
    });
  };

  return <MultiSelect {...multiSelectProps} onReorder={handleReorder} />;
}
