import { AbstractResourceEditPage, Resource } from "@/features/resources";
import type { ResourceEditPageProps } from "@/types/components";

export default function EditGuideArticlePage(props: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage resource={Resource.GuideArticles} {...props} />
  );
}
