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
      sortFields={{ name: "nazwy", shortDescription: "opisu" }}
      searchFields={{ name: "nazwie", description: "opisie" }}
      mapItemToList={(item) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
      })}
    />
  );
}
