import type { ComponentType } from "react";

import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import { ArlItem } from "./arl-item";
import type { ItemProps } from "./arl-item";

export function ArlItems<T extends EditableResource>({
  items,
  resource,
  relatedResources,
  orderable = false,
  ItemComponent = ArlItem,
}: {
  items: ResourceDataType<T>[];
  resource: T;
  relatedResources: ResourceRelations<T>;
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
          relatedResources={relatedResources}
          orderable={orderable}
        />
      ))}
    </ul>
  );
}
