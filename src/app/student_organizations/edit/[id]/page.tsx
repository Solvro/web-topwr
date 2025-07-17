import { AbstractEditPage } from "@/components/abstract-edit-page";
import type { StudentOrganization } from "@/types/app";

import { Form } from "../../form";

export default function EditStudentOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractEditPage<StudentOrganization>
      resource="student_organizations"
      params={params}
      FormComponent={Form}
    />
  );
}
