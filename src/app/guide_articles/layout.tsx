"use client";

import { usePathname } from "next/navigation";

import { AbstractResourceLayout } from "../components/abstract-resource-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let title = "Page";

  const titleMap: Record<string, string> = {
    "/guide_articles/create": "Dodawanie artykułu",
    "/guide_articles/edit": "Edycja artykułu",
    "/guide_articles": "Zarządzenie artykułami",
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
