import { getResourcePkValue } from "@/features/resources";
import type {
  EditableResource,
  ResourceDataType,
} from "@/features/resources/types";
import type { ResourceRelations } from "@/types/components";

import { ArlItem } from "./arl-item";
import { SortableItemWrapper } from "./sortable-item-wrapper";

export function SortableItem<T extends EditableResource>({
  item,
  resource,
  relatedResources,
}: {
  item: ResourceDataType<T>;
  resource: T;
  relatedResources: ResourceRelations<T>;
}) {
  const id = getResourcePkValue(resource, item);

  return (
    <SortableItemWrapper id={id}>
      {({ dragHandleProps, style, setNodeRef }) => (
        <div style={style}>
          <ArlItem
            ref={setNodeRef}
            item={item}
            resource={resource}
            relatedResources={relatedResources}
            dragHandleProps={dragHandleProps}
          />
        </div>
      )}
    </SortableItemWrapper>
  );
}
