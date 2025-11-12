import { AbstractResourceList } from "@/features/abstract-resource-collection";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function MilestonesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Milestones}
      sortableFields={["name"]}
      parentResource={Resource.AboutUs}
      {...props}
    />
  );
}
