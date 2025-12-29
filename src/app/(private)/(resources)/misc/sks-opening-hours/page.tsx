import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function SksOpeningHoursPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.SksOpeningHours}
      sortableFields={[]}
      parentResource={Resource.MobileConfig}
      {...props}
    />
  );
}
