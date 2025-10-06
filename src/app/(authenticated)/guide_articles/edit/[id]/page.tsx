import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";
import type { ResourceEditPageProps } from "@/types/app";

export default function EditGuideArticlePage({
  params,
}: ResourceEditPageProps) {
  return (
    <AbstractResourceEditPage
      resource={Resource.GuideArticles}
      params={params}
    />
  );
}
