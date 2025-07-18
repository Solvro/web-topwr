"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { ResourcePaths } from "@/lib/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    [`/${ResourcePaths.StudentOrganizations}/create`]: "Dodawanie organizacji",
    [`/${ResourcePaths.StudentOrganizations}/edit`]: "Edycja organizacji",
    [`/${ResourcePaths.StudentOrganizations}`]: "Zarządzanie organizacjami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
