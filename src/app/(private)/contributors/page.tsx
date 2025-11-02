import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function ContributorsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Contributors}
      sortableFields={["name"]}
      {...props}
    />
  );
}
