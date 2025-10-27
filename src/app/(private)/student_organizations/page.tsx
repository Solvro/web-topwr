import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/components";

export default function StudentOrganizationsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.StudentOrganizations}
      sortableFields={["name", "shortDescription"]}
      searchableFields={["name", "description"]}
      {...props}
    />
  );
}
