import { AbstractResourceList } from "@/features/abstract-resource-collection";
import { Resource } from "@/features/resources";
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
