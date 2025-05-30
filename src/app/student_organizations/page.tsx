"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import type { StudentOrganization } from "@/lib/types";

import { AbstractList } from "../components/abstract-list";

function StudentOrganizationsContent() {
  const [organizations, setOrganizations] = useState<StudentOrganization[]>([]);

  const searchParameters = useSearchParams();
  const page = Number.parseInt((searchParameters.get("page") ?? "") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 10;
  const [resultsNumber, setResultsNumber] = useState(0);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `https://api.topwr.solvro.pl/api/v1/student_organizations?page=${String(page)}&limit=${String(resultsPerPage)}`,
        );
        const { data, meta } = (await response.json()) as {
          data: StudentOrganization[];
          meta: { total: number };
        };
        setTotalPages(Math.ceil(meta.total / resultsPerPage));
        setResultsNumber(meta.total);
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setOrganizations([]);
      }
    };
    void fetchOrganizations();
  }, [page]);

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

export default function StudentOrganizationsPage() {
  return (
    <Suspense fallback={<div></div>}>
      <StudentOrganizationsContent />
    </Suspense>
  );
}
