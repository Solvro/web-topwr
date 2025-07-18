"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AbstractResourceLayout
      resource={Resource.StudentOrganizations}
      titleMap={{
        "/create": "Dodawanie organizacji",
        "/edit": "Edycja organizacji",
        "": "Zarządzanie organizacjami",
      }}
      pathname={pathname}
    >
      {children}
    </AbstractResourceLayout>
  );
}
