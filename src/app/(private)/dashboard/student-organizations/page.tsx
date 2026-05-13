import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function StudentOrganizationsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.StudentOrganizations}
      sortableFields={["id", "name", "shortDescription"]}
      {...props}
    />
  );
}
