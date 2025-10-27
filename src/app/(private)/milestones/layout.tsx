import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

export default function MilestonesLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Milestones} {...props} />;
}
