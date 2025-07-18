import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { ResourcePaths } from "@/lib/enums";
import type { StudentOrganization } from "@/types/app";

export default function StudentOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={ResourcePaths.StudentOrganizations}
      searchParams={searchParams}
      mapItemToList={(item: StudentOrganization) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
      })}
      addButtonLabel="Dodaj organizację studencką"
    />
  );
}
