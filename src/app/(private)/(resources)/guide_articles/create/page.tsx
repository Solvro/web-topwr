import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { Resource } from "@/features/resources";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateGuideArticlePage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.GuideArticles} {...props} />;
}
