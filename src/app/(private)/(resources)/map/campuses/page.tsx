import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function CampusesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Campuses}
      sortableFields={["name"]}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
