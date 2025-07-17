import { AbstractResource } from "@/components/abstract-resource";
import type { GuideArticle } from "@/types/app";

export default function GuideArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <AbstractResource
      resource="guide_articles"
      searchParams={searchParams}
      mapItemToList={(item: GuideArticle) => ({
        id: item.id,
        name: item.title,
        shortDescription: item.shortDesc,
      })}
    />
  );
}
