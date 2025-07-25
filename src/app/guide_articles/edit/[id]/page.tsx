import { AbstractResourceEditPage } from "@/components/abstract/abstract-resource-edit-page";
import { Resource } from "@/config/enums";

import { Form } from "../../form";

export default function EditGuideArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractResourceEditPage
      resource={Resource.GuideArticles}
      params={params}
      FormComponent={Form}
    />
  );
}
