import { AbstractResourceList } from "@/components/abstract/resource-list";
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
      sortableFields={["title", "description"]}
      searchableFields={["title", "description"]}
      orderable
    />
  );
}
