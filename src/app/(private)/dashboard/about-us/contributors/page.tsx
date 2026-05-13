import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function ContributorsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Contributors}
      sortableFields={["name"]}
      parentResource={Resource.AboutUs}
      {...props}
    />
  );
}
