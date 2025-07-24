import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/config/enums";
import type { GuideArticle } from "@/types/app";

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
      mapItemToList={(item: GuideArticle) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.shortDesc,
      })}
    />
  );
}
