import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { Resource } from "@/config/enums";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

const formInputs = {
  imageInputs: [
    {
      label: "Zdjęcie",
      name: "imageKey",
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
} satisfies AbstractResourceFormInputs<Resource.GuideArticles>;

export function Form({
  initialData,
}: {
  initialData?: ResourceDataType<Resource.GuideArticles> | null;
}) {
  const defaultValues: ResourceFormValues<Resource.GuideArticles> =
    initialData ?? {
      title: "",
      imageKey: "",
      description: "",
      shortDesc: "",
    };

  return (
    <AbstractResourceForm
      resource={Resource.GuideArticles}
      defaultValues={defaultValues}
      formInputs={formInputs}
    />
  );
}
