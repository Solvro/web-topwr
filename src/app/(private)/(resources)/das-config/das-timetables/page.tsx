import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasTimetablesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasTimetables}
      parentResource={Resource.Das}
      {...props}
    />
  );
}
