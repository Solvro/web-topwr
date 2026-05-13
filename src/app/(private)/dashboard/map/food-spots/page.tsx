import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function FoodSpotsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.FoodSpots}
      sortableFields={["name"]}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
