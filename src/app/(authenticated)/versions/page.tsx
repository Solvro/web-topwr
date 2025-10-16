import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";

export default function VersionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.Versions}
      searchParams={searchParams}
      sortableFields={["name", "description"]}
      searchableFields={["name", "description"]}
    />
  );
}
