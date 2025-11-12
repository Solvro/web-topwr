import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
import type { ResourcePageProps } from "@/types/components";

export default function StudentOrganizationsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.StudentOrganizations}
      sortableFields={["name", "shortDescription"]}
      {...props}
    />
  );
}
