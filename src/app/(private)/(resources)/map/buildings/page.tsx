import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function BuildingsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Buildings}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
