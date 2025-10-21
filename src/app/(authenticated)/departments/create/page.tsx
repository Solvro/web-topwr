import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateDepartmentPage() {
  return <AbstractResourceForm resource={Resource.Departments} />;
}
