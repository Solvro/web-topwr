import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
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
