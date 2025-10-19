import { AbstractResourceLayout } from "@/components/abstract/abstract-resource-layout";
import { Resource } from "@/config/enums";
import type { LayoutProps } from "@/types/app";

export default function BannersLayout(props: LayoutProps) {
  return <AbstractResourceLayout resource={Resource.Banners} {...props} />;
}
