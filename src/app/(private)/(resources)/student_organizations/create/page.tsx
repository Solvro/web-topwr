import { Resource } from "@/config/enums";
import { AbstractResourceForm } from "@/features/abstract-resource-form/index";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateStudentOrganizationPage(
  props: ResourceCreatePageProps,
) {
  return (
    <AbstractResourceForm resource={Resource.StudentOrganizations} {...props} />
  );
}
