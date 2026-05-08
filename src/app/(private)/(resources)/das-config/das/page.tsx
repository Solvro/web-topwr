import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasLinksPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Das}
      parentResource={Resource.DasTimetables}
      {...props}
    />
  );
}
