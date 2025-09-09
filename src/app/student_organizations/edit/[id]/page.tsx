import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";

export default function EditStudentOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractResourceEditPage
      resource={Resource.StudentOrganizations}
      params={params}
    />
  );
}
