import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateDepartmentPage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.Departments} {...props} />;
}
