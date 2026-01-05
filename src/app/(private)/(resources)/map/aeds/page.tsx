import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function AedsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Aeds}
      parentResource={Resource.Map}
      {...props}
    />
  );
}
