import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function DasMapsPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.DasMaps}
      parentResource={Resource.Das}
      {...props}
    />
  );
}
