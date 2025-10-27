import { AbstractResourceLayout } from "@/components/abstract/resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/components";

export default function VersionsLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Versions} {...props} />;
}
