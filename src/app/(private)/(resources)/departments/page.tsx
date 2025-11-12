import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
import type { ResourcePageProps } from "@/types/components";

export default function DepartmentsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Departments}
      sortableFields={["name", "description", "code", "betterCode"]}
      {...props}
    />
  );
}
