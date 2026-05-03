import { AbstractResourceLayout } from "@/features/resources/server";
import type { WrapperProps } from "@/types/components";

export default function ReviewLayout({ children }: WrapperProps) {
  return (
    <AbstractResourceLayout route="/drafts" header="Drafty">
      {children}
    </AbstractResourceLayout>
  );
}
