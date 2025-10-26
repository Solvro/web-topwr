import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

export default function ContributorsLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Contributors} {...props} />;
}
