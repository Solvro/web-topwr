import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasTimetableEntriesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasTimetableEntries}
      parentResource={Resource.Das}
      {...props}
    />
  );
}
