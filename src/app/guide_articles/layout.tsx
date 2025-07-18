"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/lib/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    [`/${Resource.GuideArticles}/create`]: "Dodawanie artykułu",
    [`/${Resource.GuideArticles}/edit`]: "Edycja artykułu",
    [`/${Resource.GuideArticles}`]: "Zarządzenie artykułami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
