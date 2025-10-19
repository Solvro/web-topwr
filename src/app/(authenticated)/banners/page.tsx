import { AbstractResourceList } from "@/components/abstract/resource-list";
import { Resource } from "@/config/enums";
import type { ResourcePageProps } from "@/types/app";

export default function BannerPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.Banners}
      sortableFields={["title", "description"]}
      searchableFields={["title", "description"]}
      {...props}
    />
  );
}
