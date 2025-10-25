import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";
import type { ResourceCreatePageProps } from "@/types/components";

export default function CreateGuideArticlePage(props: ResourceCreatePageProps) {
  return <AbstractResourceForm resource={Resource.GuideArticles} {...props} />;
}
