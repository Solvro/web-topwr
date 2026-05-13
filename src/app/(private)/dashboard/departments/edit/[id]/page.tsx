import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditDepartmentPage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.Departments} {...props} />
  );
}
