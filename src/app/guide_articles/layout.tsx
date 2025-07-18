"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { ResourcePaths } from "@/lib/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const titleMap = {
    [`/${ResourcePaths.GuideArticles}/create`]: "Dodawanie artykułu",
    [`/${ResourcePaths.GuideArticles}/edit`]: "Edycja artykułu",
    [`/${ResourcePaths.GuideArticles}`]: "Zarządzenie artykułami",
  };

  return (
    <AbstractResourceLayout titleMap={titleMap} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
