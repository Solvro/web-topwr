import type { LayoutProps } from "@/types/components";

import { BackToHomeButton } from "./back-to-home-button";

export function AbstractResourceGroup({ children }: LayoutProps) {
  return (
    <div className="flex h-full flex-col items-start gap-4 sm:pt-4 lg:pt-16">
      {children}
      <BackToHomeButton className="mt-auto" chevronsIcon />
    </div>
  );
}
