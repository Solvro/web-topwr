import { AbstractResourceList } from "@/features/abstract-resource-collection";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function AboutUsLinksPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.AboutUsLinks}
      parentResource={Resource.AboutUs}
      {...props}
    />
  );
}
