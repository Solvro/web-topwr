import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/config/enums";

export default function GuideArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResourceList
      resource={Resource.GuideArticles}
      searchParams={searchParams}
      sortFields={{ title: "tytułu", shortDesc: "opisu" }}
      searchFields={{ title: "tytule", description: "opisie" }}
      mapItemToList={(item) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.shortDesc,
      })}
    />
  );
}
