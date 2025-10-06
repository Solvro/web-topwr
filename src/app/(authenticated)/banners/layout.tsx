"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";

export default function BannerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AbstractResourceLayout resource={Resource.Banners} pathname={pathname}>
      {children}
    </AbstractResourceLayout>
  );
}
