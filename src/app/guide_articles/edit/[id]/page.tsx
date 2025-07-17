import { AbstractEditPage } from "@/components/abstract-edit-page";

import { Form } from "../../form";

export default function EditGuideArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AbstractEditPage
      resource="guide_articles"
      params={params}
      FormComponent={Form}
    />
  );
}
