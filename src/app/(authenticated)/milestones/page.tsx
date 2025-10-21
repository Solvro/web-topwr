import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";

export default function MilestonesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.Milestones}
      searchParams={searchParams}
      sortableFields={["name"]}
      searchableFields={["name"]}
    />
  );
}
