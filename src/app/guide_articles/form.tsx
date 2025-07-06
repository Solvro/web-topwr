"use client";

import { AbstractEditor } from "@/components/abstract-resource-form";
import type {
  formImageInputs,
  formRichTextInput,
  formTextInputs,
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

const imageInputs: formImageInputs[] = [
  {
    label: "Zdjęcie",
  },
];

const textInputs: formTextInputs[] = [
  {
    name: "title",
    label: "Tytuł",
  },
  {
    name: "shortDesc",
    label: "Krótki opis",
  },
];

const richTextInput: formRichTextInput = {
  name: "description",
  label: "Opis",
};

export function Editor({ initialData }: { initialData?: GuideArticle | null }) {
  const defaultValues: GuideArticleFormValues = initialData ?? {
    ...(null as unknown as GuideArticleFormValues),
    imageKey: null,
    description: "",
    shortDesc: "",
  };

  return (
    <AbstractEditor
      schema={GuideArticleSchema}
      defaultValues={defaultValues}
      createOnSubmit={createOnSubmit}
      editOnSubmit={editOnSubmit}
      imageInputs={imageInputs}
      textInputs={textInputs}
      richTextInput={richTextInput}
      returnButtonLabel="Wróć do artykułów"
    ></AbstractEditor>
  );
}
