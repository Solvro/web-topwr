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
      sortableFields={["title", "description"]}
      searchableFields={["title", "description"]}
      resourceMapper={(item) => ({
        name: item.title,
        shortDescription: item.shortDesc,
      })}
      orderable
    />
  );
}
