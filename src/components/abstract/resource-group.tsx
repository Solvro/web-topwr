import type { LayoutProps } from "@/types/components";

import { BackToHomeButton } from "../presentation/back-to-home-button";

export function AbstractResourceGroup({ children }: LayoutProps) {
  return (
    <section className="flex h-full flex-col items-start gap-4 sm:pt-4 lg:pt-16">
      {children}
      <BackToHomeButton className="mt-auto" chevronsIcon />
    </section>
  );
}
