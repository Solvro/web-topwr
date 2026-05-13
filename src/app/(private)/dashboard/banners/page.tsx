import { AbstractResourceList } from "@/features/abstract-resource-list";
import { Resource } from "@/features/resources";
import type { ResourcePageProps } from "@/types/components";

export default function BannersPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Banners}
      sortableFields={["title", "description"]}
      {...props}
    />
  );
}
