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
  AbstractResourceFormInputs,
  StudentOrganizationFormValues,
} from "@/types/forms";

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

const formInputs: AbstractResourceFormInputs<StudentOrganizationFormValues> = {
  imageInputs: [
    {
      label: "Logo",
    },
    {
      label: "Baner",
    },
  ],
  textInputs: [
    {
      name: "name",
      label: "Nazwa",
    },
    {
      name: "shortDescription",
      label: "Krótki opis",
    },
  ],
  richTextInput: {
    name: "description",
    label: "Opis",
  },
  selectInputs: [
    {
      name: "departmentId",
      label: "Wydział",
      placeholder: "Wybierz wydział",
      options: enumToFormSelectOptions(
        DepartmentIds,
        SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT,
      ),
      isOptional: true,
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
  ],
  checkboxInputs: [
    {
      name: "isStrategic",
      label: "Czy jest kołem strategicznym?",
    },
  ],
};

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
      formInputs={formInputs}
      returnButtonPath={`/${Resource.StudentOrganizations}`}
      returnButtonLabel="Wróć do organizacji"
    />
  );
}
