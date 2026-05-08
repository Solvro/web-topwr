import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasLinksPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasLinks}
      parentResource={Resource.Das}
      {...props}
    />
  );
}
