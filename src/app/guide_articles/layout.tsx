"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AbstractResourceLayout
      resource={Resource.GuideArticles}
      pathname={pathname}
    >
      {children}
    </AbstractResourceLayout>
  );
}
