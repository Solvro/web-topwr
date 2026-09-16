import type { ReactNode } from "react";

import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";

export default function DasOrganizationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AbstractResourceLayout resource={Resource.DasOrganizations}>
      {children}
    </AbstractResourceLayout>
  );
}
