import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function MilestonesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Milestones}
      sortableFields={["name"]}
      {...props}
    />
  );
}
