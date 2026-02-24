import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getResourcePkValue } from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import { ArlItem } from "./arl-item";

export function SortableItem<T extends EditableResource>({
  item,
  resource,
  relatedResources,
}: {
  item: ResourceDataType<T>;
  resource: T;
  relatedResources: ResourceRelations<T>;
}) {
  const { setNodeRef, transform, transition } = useSortable({
    id: getResourcePkValue(resource, item),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style}>
      <ArlItem
        ref={setNodeRef}
        item={item}
        resource={resource}
        relatedResources={relatedResources}
        orderable
      />
    </div>
  );
}
