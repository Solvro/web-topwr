import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
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
