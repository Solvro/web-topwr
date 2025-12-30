import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function PinkBoxesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.PinkBoxes}
      sortableFields={["roomOrNearby"]}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
