import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function VersionsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Versions}
      sortableFields={["name", "description"]}
      searchableFields={["name", "description"]}
      {...props}
    />
  );
}
