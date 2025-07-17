import { AbstractEditPage } from "@/components/abstract-edit-page";

import { Form } from "../../form";

export default function EditStudentOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractEditPage
      resource="student_organizations"
      params={params}
      FormComponent={Form}
    />
  );
}
