import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
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
