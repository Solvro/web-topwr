import { Resource } from "@/config/enums";
import { AbstractResourceList } from "@/features/abstract-resource-collection";
import type { ResourcePageProps } from "@/types/components";

export default function GuideArticlesPage(props: ResourcePageProps) {
  return (
    <AbstractResourceList
      resource={Resource.GuideArticles}
      sortableFields={["title", "description"]}
      {...props}
    />
  );
}
