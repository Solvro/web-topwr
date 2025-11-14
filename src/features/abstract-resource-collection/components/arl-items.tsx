import type { ComponentType } from "react";

import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";

import { ArlItem } from "./arl-item";
import type { ItemProps } from "./arl-item";

export function ArlItems<T extends EditableResource>({
  items,
  resource,
  orderable = false,
  ItemComponent = ArlItem,
}: {
  items: ResourceDataType<T>[];
  resource: T;
  orderable?: boolean;
  ItemComponent?: ComponentType<ItemProps<T>>;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemComponent
          key={String(item.id)}
          item={item}
          resource={resource}
          orderable={orderable}
        />
      ))}
    </ul>
  );
}
