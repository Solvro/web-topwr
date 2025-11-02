import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
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
