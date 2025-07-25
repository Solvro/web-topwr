import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";
import type { GuideArticle } from "@/types/app";
import type {
  FormImageInput,
  FormRichTextInput,
  FormTextInput,
  GuideArticleFormValues,
} from "@/types/forms";

const imageInputs: FormImageInput<GuideArticleFormValues>[] = [
  {
    label: "Zdjęcie",
    name: "imageKey",
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
    imageKey: "",
    description: "",
    shortDesc: "",
  };

  return (
    <AbstractResourceForm
      resource={Resource.GuideArticles}
      defaultValues={defaultValues}
      formInputs={{
        imageInputs,
        textInputs,
        richTextInput,
      }}
      returnButtonPath={`/${Resource.GuideArticles}`}
    />
  );
}
