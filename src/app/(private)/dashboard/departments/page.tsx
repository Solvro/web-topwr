import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
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
