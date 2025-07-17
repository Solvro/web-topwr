"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract-resource-layout";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    "/student_organizations/create": "Dodawanie organizacji",
    "/student_organizations/edit": "Edycja organizacji",
    "/student_organizations": "Zarządzanie organizacjami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
