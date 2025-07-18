import { AbstractResourceList } from "@/components/abstract/abstract-resource-list";
import { Resource } from "@/lib/enums";
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
      mapItemToList={(item: GuideArticle) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.shortDesc,
      })}
      addButtonLabel="Dodaj artykuł"
    />
  );
}
