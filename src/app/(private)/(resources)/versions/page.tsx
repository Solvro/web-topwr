import { AbstractResourceList } from "@/features/abstract-resource-collection";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function VersionsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Versions}
      sortableFields={["name", "description"]}
      {...props}
    />
  );
}
