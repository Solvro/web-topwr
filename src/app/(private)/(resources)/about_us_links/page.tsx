import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
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
