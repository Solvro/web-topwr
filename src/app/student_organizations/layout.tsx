"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/lib/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    [`/${Resource.StudentOrganizations}/create`]: "Dodawanie organizacji",
    [`/${Resource.StudentOrganizations}/edit`]: "Edycja organizacji",
    [`/${Resource.StudentOrganizations}`]: "Zarządzanie organizacjami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
