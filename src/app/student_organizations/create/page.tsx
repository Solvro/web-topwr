import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";

export default function CreateStudentOrganizationPage() {
  return <AbstractResourceForm resource={Resource.StudentOrganizations} />;
}
