"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract-resource-layout";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    "/guide_articles/create": "Dodawanie artykułu",
    "/guide_articles/edit": "Edycja artykułu",
    "/guide_articles": "Zarządzenie artykułami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
