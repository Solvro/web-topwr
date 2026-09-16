import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasFloorsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasFloors}
      parentResource={Resource.DasConfig}
      {...props}
    />
  );
}
