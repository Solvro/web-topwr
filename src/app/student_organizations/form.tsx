"use client";

import { AbstractResourceForm } from "@/components/abstract-resource-form";
import { SELECT_OPTION_LABELS } from "@/config/constants";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/form-enums";
import type {
  FormCheckboxInput,
  FormImageInput,
  FormRichTextInput,
  FormSelectInput,
  FormTextInput,
} from "@/lib/types";
import { enumToFormSelectOptions } from "@/lib/utils";
import { StudentOrganizationSchema } from "@/schemas";
import type { StudentOrganization } from "@/types/app";
import type { StudentOrganizationFormValues } from "@/types/schemas";

function createOnSubmit(data: StudentOrganizationFormValues) {
  // TODO
  // eslint-disable-next-line no-console
  console.log("Creating organization:", data);
}

function editOnSubmit(id: number, data: StudentOrganizationFormValues) {
  // TODO
  // eslint-disable-next-line no-console
  console.log(`Updating organization ${String(id)}:`, data);
}

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
    allowNull: true,
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
      schema={StudentOrganizationSchema}
      defaultValues={defaultValues}
      createOnSubmit={createOnSubmit}
      editOnSubmit={editOnSubmit}
      formInputs={{
        imageInputs,
        textInputs,
        richTextInput,
        selectInputs,
        checkboxInputs,
      }}
      returnButtonPath="/student_organizations"
      returnButtonLabel="Wróć do organizacji"
    />
  );
}
