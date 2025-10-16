import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";

export default function ChangesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.Changes}
      searchParams={searchParams}
      sortableFields={["name", "description"]}
      searchableFields={["name", "description"]}
    />
  );
}
