"use client";

import { AbstractResourceForm } from "@/components/abstract-resource-form";
import type {
  FormImageInput,
  FormRichTextInput,
  FormTextInput,
} from "@/lib/types";
import { GuideArticleSchema } from "@/schemas";
import type { GuideArticle } from "@/types/app";
import type { GuideArticleFormValues } from "@/types/schemas";

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

const imageInputs: FormImageInput[] = [
  {
    label: "Zdjęcie",
  },
];

const textInputs: FormTextInput<GuideArticleFormValues>[] = [
  {
    name: "title",
    label: "Tytuł",
  },
  {
    name: "shortDesc",
    label: "Krótki opis",
  },
];

const richTextInput: FormRichTextInput<GuideArticleFormValues> = {
  name: "description",
  label: "Opis",
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
      formInputs={{
        imageInputs,
        textInputs,
        richTextInput,
      }}
      returnButtonPath="/guide_articles"
      returnButtonLabel="Wróć do artykułów"
    />
  );
}
