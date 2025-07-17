import { AbstractEditPage } from "@/components/abstract-edit-page";
import type { GuideArticle } from "@/types/app";

import { Form } from "../../form";

export default function EditGuideArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractEditPage<GuideArticle>
      resource="guide_articles"
      params={params}
      FormComponent={Form}
    />
  );
}
