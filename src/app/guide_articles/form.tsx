"use client";

import { AbstractResourceForm } from "@/components/abstract/abstract-resource-form";
import { Resource } from "@/config/enums";
import { GuideArticleSchema } from "@/schemas";
import type { GuideArticle } from "@/types/app";
import type {
  AbstractResourceFormInputs,
  GuideArticleFormValues,
} from "@/types/forms";

function createOnSubmit(data: GuideArticleFormValues) {
  // TODO
  // eslint-disable-next-line no-console
  console.log("Creating article:", data);
}

function editOnSubmit(id: number, data: GuideArticleFormValues) {
  // TODO
  // eslint-disable-next-line no-console
  console.log(`Updating article ${String(id)}:`, data);
}

const formInputs: AbstractResourceFormInputs<GuideArticleFormValues> = {
  imageInputs: [
    {
      label: "Zdjęcie",
    },
  ],
  textInputs: [
    {
      name: "title",
      label: "Tytuł",
    },
    {
      name: "shortDesc",
      label: "Krótki opis",
    },
  ],
  richTextInput: {
    name: "description",
    label: "Opis",
  },
};

export function Form({ initialData }: { initialData?: GuideArticle | null }) {
  const defaultValues: GuideArticleFormValues = initialData ?? {
    title: "",
    imageKey: null,
    description: "",
    shortDesc: "",
  };

  return (
    <AbstractResourceForm
      schema={GuideArticleSchema}
      defaultValues={defaultValues}
      createOnSubmit={createOnSubmit}
      editOnSubmit={editOnSubmit}
      formInputs={formInputs}
      returnButtonPath={`/${Resource.GuideArticles}`}
      returnButtonLabel="Wróć do artykułów"
    />
  );
}
