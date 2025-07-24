"use client";

import { AbstractResourceForm } from "@/components/abstract/abstract-resource-form";
import { SELECT_OPTION_LABELS } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { enumToFormSelectOptions } from "@/lib/helpers";
import { StudentOrganizationSchema } from "@/schemas";
import type { StudentOrganization } from "@/types/app";
import type {
  FormCheckboxInput,
  FormImageInput,
  FormRichTextInput,
  FormSelectInput,
  FormTextInput,
  StudentOrganizationFormValues,
} from "@/types/forms";

const imageInputs: FormImageInput[] = [
  {
    label: "Logo",
  },
  {
    label: "Baner",
  },
];

const textInputs: FormTextInput<StudentOrganizationFormValues>[] = [
  {
    name: "name",
    label: "Nazwa",
    required: true,
  },
  {
    name: "shortDescription",
    label: "Krótki opis",
  },
];

const richTextInput: FormRichTextInput<StudentOrganizationFormValues> = {
  name: "description",
  label: "Opis",
};

const selectInputs: FormSelectInput<StudentOrganizationFormValues>[] = [
  {
    name: "departmentId",
    label: "Wydział",
    placeholder: "Wybierz wydział",
    options: enumToFormSelectOptions(
      DepartmentIds,
      SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT,
    ),
  },
  {
    name: "source",
    label: "Źródło",
    placeholder: "Wybierz źródło",
    options: enumToFormSelectOptions(
      OrganizationSource,
      SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE,
    ),
  },
  {
    name: "organizationType",
    label: "Typ",
    placeholder: "Wybierz typ",
    options: enumToFormSelectOptions(
      OrganizationType,
      SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE,
    ),
  },
  {
    name: "organizationStatus",
    label: "Status",
    placeholder: "Wybierz status",
    options: enumToFormSelectOptions(
      OrganizationStatus,
      SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.STATUS,
    ),
  },
];

const checkboxInputs: FormCheckboxInput<StudentOrganizationFormValues>[] = [
  {
    name: "isStrategic",
    label: "Czy jest kołem strategicznym?",
  },
];

export function Form({
  initialData,
}: {
  initialData?: StudentOrganization | null;
}) {
  const defaultValues: StudentOrganizationFormValues = initialData ?? {
    name: "",
    departmentId: null,
    logoKey: null,
    coverKey: null,
    description: null,
    shortDescription: null,
    coverPreview: false, // pojęcia nie mam co to jest, te organizacje co są już w bazie mają to w 99% przypadków na false
    source: OrganizationSource.Manual,
    organizationType: OrganizationType.ScientificClub,
    organizationStatus: OrganizationStatus.Active,
    isStrategic: false,
  };

  return (
    <AbstractResourceForm
      resource={Resource.StudentOrganizations}
      schema={StudentOrganizationSchema}
      defaultValues={defaultValues}
      formInputs={{
        imageInputs,
        textInputs,
        richTextInput,
        selectInputs,
        checkboxInputs,
      }}
      returnButtonPath={`/${Resource.StudentOrganizations}`}
    />
  );
}
