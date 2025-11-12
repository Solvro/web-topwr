import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
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
