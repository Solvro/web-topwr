import type { ReactNode } from "react";

import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";

export default function DasFloorsLayout({ children }: { children: ReactNode }) {
  return (
    <AbstractResourceLayout resource={Resource.DasFloors}>
      {children}
    </AbstractResourceLayout>
  );
}
