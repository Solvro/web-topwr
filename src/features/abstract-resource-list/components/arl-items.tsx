import type { ComponentType } from "react";

import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import { ArlItem } from "./arl-item";
import type { ItemProps } from "./arl-item";

interface ArlItemsProps<T extends EditableResource> {
  items: ResourceDataType<T>[];
  resource: T;
  relatedResources: ResourceRelations<T>;
  ItemComponent?: ComponentType<Omit<ItemProps<T>, "dragHandleProps">>;
}

export function ArlItems<T extends EditableResource>({
  items,
  resource,
  relatedResources,
  ItemComponent = ArlItem,
}: ArlItemsProps<T>) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemComponent
          key={String(item.id)}
          item={item}
          resource={resource}
          relatedResources={relatedResources}
        />
      ))}
    </ul>
  );
}
