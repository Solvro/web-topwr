import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/config/enums";

export default function BannerPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.Banners}
      searchParams={searchParams}
      sortableFields={["title", "description"]}
      searchableFields={["title", "description"]}
      resourceMapper={(item) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.description,
      })}
    />
  );
}
