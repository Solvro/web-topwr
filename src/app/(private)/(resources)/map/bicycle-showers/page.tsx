import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function BicycleShowersPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.BicycleShowers}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
