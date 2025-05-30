"use client";

import { usePathname } from "next/navigation";

import { AbstractResourceLayout } from "../components/abstract-resource-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let title = "Page";

  const titleMap: Record<string, string> = {
    "/student_organizations/create": "Dodawanie organizacji",
    "/student_organizations/edit": "Edycja organizacji",
    "/student_organizations": "Zarządzenie organizacjami",
  };

  const matched = Object.entries(titleMap).find(([key]) => {
    const isMatch = pathname.startsWith(key);
    return isMatch;
  });

  if (matched != null) {
    title = matched[1];
  }

  return (
    <AbstractResourceLayout title={title}>{children}</AbstractResourceLayout>
  );
}
