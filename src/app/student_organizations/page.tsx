import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/config/enums";

export default function StudentOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.StudentOrganizations}
      searchParams={searchParams}
      sortableFields={["name", "shortDescription"]}
      searchableFields={["name", "description"]}
      resourceMapper={(item) => ({
        name: item.name,
        shortDescription: item.shortDescription,
      })}
      orderable
    />
  );
}
