import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function LibrariesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Libraries}
      sortableFields={["title"]}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
