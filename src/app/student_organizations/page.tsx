import { AbstractResource } from "@/components/abstract-resource";
import type { StudentOrganization } from "@/types/app";

export default function StudentOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResource<StudentOrganization>
      resource="student_organizations"
      searchParams={searchParams}
      mapItemToList={(item) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
      })}
    />
  );
}
