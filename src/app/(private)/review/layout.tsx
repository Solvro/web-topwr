import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import type { LayoutProps } from "@/types/components";

export default function ReviewLayout({ children }: LayoutProps) {
  return (
    <AbstractResourceLayout route="/review" header="Review zmian">
      {children}
    </AbstractResourceLayout>
  );
}
