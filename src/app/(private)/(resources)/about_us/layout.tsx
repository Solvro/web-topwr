import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { LayoutProps } from "@/types/components";

export default function AboutUsLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout
      resource={Resource.AboutUs}
      labelOptions={{ firstWordOnly: false }}
      {...props}
    />
  );
}
