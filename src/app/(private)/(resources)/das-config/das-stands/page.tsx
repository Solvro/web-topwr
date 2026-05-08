import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasStandsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasStands}
      parentResource={Resource.Das}
      {...props}
    />
  );
}
