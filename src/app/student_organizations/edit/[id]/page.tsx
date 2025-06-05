import { API_URL } from "@/config/api";
import type { StudentOrganization } from "@/lib/types";

import { Editor } from "../../editor";

async function getStudentOrganization(
  id: string,
): Promise<StudentOrganization | null> {
  try {
    const sanitizedId = String(id).split(/ /)[0].replaceAll(/[^\d]/g, "");
    const response = await fetch(
      `${API_URL}/api/v1/student_organizations/${sanitizedId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student organization: ${String(response.status)}`,
      );
    }

    const { data } = (await response.json()) as {
      data: StudentOrganization;
    };

    return data;
  } catch (error) {
    console.error("Error fetching student organization:", error);
    return null;
  }
}

export default async function EditStudentOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentOrganization = await getStudentOrganization(id);

  return <Editor initialData={studentOrganization} />;
}
