import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { ResourcePaths } from "@/lib/enums";

import { Form } from "../../form";

export default function EditStudentOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractResourceEditPage
      resource={ResourcePaths.StudentOrganizations}
      params={params}
      FormComponent={Form}
    />
  );
}
