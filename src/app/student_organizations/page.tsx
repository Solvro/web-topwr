import { AbstractList } from "@/components/abstract-list";
import { API_URL } from "@/config/api";
import type { StudentOrganization } from "@/lib/types";

async function fetchStudentOrganizations(page: number, resultsPerPage: number) {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/student_organizations?page=${String(page)}&limit=${String(resultsPerPage)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student organizations: ${String(response.status)}`,
      );
    }

    const { data, meta } = (await response.json()) as {
      data: StudentOrganization[];
      meta: { total: number };
    };

    return { data, meta };
  } catch (error) {
    console.error("Error fetching student organizations:", error);
    return { data: [], meta: { total: 0 } };
  }
}

export default async function StudentOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);
  const resultsPerPage = 10; // może będzie do zmiany przez użytkownika w przyszłości

  const { data: organizations, meta } = await fetchStudentOrganizations(
    page,
    resultsPerPage,
  );
  const totalPages = Math.ceil(meta.total / resultsPerPage);
  const resultsNumber = meta.total;

  return (
    <AbstractList
      resource="student_organizations"
      data={organizations}
      page={page}
      totalPages={totalPages}
      resultsNumber={resultsNumber}
    />
  );
}
