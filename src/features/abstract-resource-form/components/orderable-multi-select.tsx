"use client";

import { useRef } from "react";

import { MultiSelect } from "@/components/ui/multi-select";
import { calculateNewSortValue } from "@/features/abstract-resource-list";
import type {
  OrderableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { useRelationOrderMutation } from "../hooks/use-relation-order-mutation";

interface OrderableMultiSelectProps<T extends OrderableResource> {
  resourceRelation: T;
  items: ResourceDataType<T>[];
  multiSelectProps: React.ComponentProps<typeof MultiSelect>;
}

export function OrderableMultiSelect<T extends OrderableResource>({
  resourceRelation,
  items,
  multiSelectProps,
}: OrderableMultiSelectProps<T>) {
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const { mutateOrder } = useRelationOrderMutation({ resourceRelation });

  const handleReorder = (id: string, oldIndex: number, newIndex: number) => {
    const order = calculateNewSortValue(
      itemsRef.current as ResourceDataType<OrderableResource>[],
      oldIndex,
      newIndex,
    );
    void mutateOrder(id, order);
  };

  return <MultiSelect {...multiSelectProps} onReorder={handleReorder} />;
}
