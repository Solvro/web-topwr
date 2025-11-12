import { AbstractResourceLayout } from "@/features/resources";
import type { LayoutProps } from "@/types/components";

export default function ReviewLayout({ children }: LayoutProps) {
  return (
    <AbstractResourceLayout route="/review" header="Review zmian">
      {children}
    </AbstractResourceLayout>
  );
}
