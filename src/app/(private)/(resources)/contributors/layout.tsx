import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { LayoutProps } from "@/types/components";

export default function ContributorsLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Contributors} {...props} />;
}
