import { ChevronsLeft } from "lucide-react";

import { ReturnButton } from "@/components/presentation/return-button";
import type { WrapperProps } from "@/types/components";

import { Resource } from "../enums";

export function AbstractResourceGroup({ children }: WrapperProps) {
  return (
    <section className="flex h-full flex-col items-start gap-4 sm:pt-4 lg:pt-16">
      {children}
      <ReturnButton
        resource={Resource.Dashboard}
        className="mt-auto"
        icon={ChevronsLeft}
      />
    </section>
  );
}
