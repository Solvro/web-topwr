import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateDepartmentPage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.Departments} {...props} />;
}
