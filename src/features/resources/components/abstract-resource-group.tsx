import { BackToHomeButton } from "@/components/presentation/back-to-home-button";
import type { WrapperProps } from "@/types/components";

export function AbstractResourceGroup({ children }: WrapperProps) {
  return (
    <section className="flex h-full flex-col items-start gap-4 sm:pt-4 lg:pt-16">
      {children}
      <BackToHomeButton className="mt-auto" chevronsIcon />
    </section>
  );
}
