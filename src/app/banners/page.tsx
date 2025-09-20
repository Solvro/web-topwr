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
      sortFields={{ title: "tytułu", description: "opisu" }}
      searchFields={{ title: "tytule", description: "opisie" }}
      mapItemToList={(item) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.description,
      })}
    />
  );
}
