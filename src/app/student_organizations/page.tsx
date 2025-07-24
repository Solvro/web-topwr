import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/config/enums";
import type { StudentOrganization } from "@/types/app";

export default function StudentOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.StudentOrganizations}
      searchParams={searchParams}
      mapItemToList={(item: StudentOrganization) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
      })}
    />
  );
}
