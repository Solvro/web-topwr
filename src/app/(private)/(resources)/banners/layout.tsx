import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { LayoutProps } from "@/types/components";

export default function BannersLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Banners} {...props} />;
}
