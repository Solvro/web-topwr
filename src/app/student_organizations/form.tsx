"use client";

import { AbstractEditor } from "@/components/abstract-resource-form";
import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/types";
import type {
  formCheckboxInputs,
  formImageInputs,
  formRichTextInput,
  formSelectInputs,
  formTextInputs,
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

const imageInputs: formImageInputs[] = [
  {
    label: "Logo",
  },
  {
    label: "Baner",
  },
];

const textInputs: formTextInputs[] = [
  {
    name: "name",
    label: "Nazwa",
  },
  {
    name: "shortDescription",
    label: "Krótki opis",
  },
];

const richTextInput: formRichTextInput = {
  name: "description",
  label: "Opis",
};

const selectInputs: formSelectInputs[] = [
  {
    name: "departmentId",
    label: "Wydział",
    placeholder: "Wybierz wydział",
    options: enumToFormSelectOptions(DepartmentIds, {
      [DepartmentIds.Architecture]: "Wydział Architektury",
      [DepartmentIds.CivilEngineering]:
        "Wydział Budownictwa Lądowego i Wodnego",
      [DepartmentIds.Chemistry]: "Wydział Chemiczny",
      [DepartmentIds.ComputerScienceAndTelecommunications]:
        "Wydział Informatyki i Telekomunikacji",
      [DepartmentIds.ElectricalEngineering]: "Wydział Elektryczny",
      [DepartmentIds.GeoengineeringMiningAndGeology]:
        "Wydział Geoinżynierii, Górnictwa i Geologii",
      [DepartmentIds.EnvironmentalEngineering]: "Wydział Inżynierii Środowiska",
      [DepartmentIds.Management]: "Wydział Zarządzania",
      [DepartmentIds.MechanicalAndPowerEngineering]:
        "Wydział Mechaniczno-Energetyczny",
      [DepartmentIds.Mechanical]: "Wydział Mechaniczny",
      [DepartmentIds.FundamentalProblemsOfTechnology]:
        "Wydział Podstawowych Problemów Techniki",
      [DepartmentIds.ElectronicsPhotonicsAndMicrosystems]:
        "Wydział Elektroniki, Fotoniki i Mikrosystemów",
      [DepartmentIds.Mathematics]: "Wydział Matematyki",
      [DepartmentIds.Medical]: "Wydział Medyczny",
    }),
    allowNull: true,
  },
  {
    name: "source",
    label: "Źródło",
    placeholder: "Wybierz źródło",
    options: enumToFormSelectOptions(OrganizationSource, {
      [OrganizationSource.StudentDepartment]: "Dział Studencki",
      [OrganizationSource.Manual]: "Ręcznie",
      [OrganizationSource.PwrActive]: "PWR Active",
    }),
  },
  {
    name: "organizationType",
    label: "Typ",
    placeholder: "Wybierz typ",
    options: enumToFormSelectOptions(OrganizationType, {
      [OrganizationType.ScientificClub]: "Koło naukowe",
      [OrganizationType.StudentOrganization]: "Organizacja studencka",
      [OrganizationType.StudentMedium]: "Organizacja medialna",
      [OrganizationType.CultureAgenda]: "Organizacja kulturalna",
      [OrganizationType.StudentCouncil]: "Samorząd studencki",
    }),
  },
  {
    name: "organizationStatus",
    label: "Status",
    placeholder: "Wybierz status",
    options: enumToFormSelectOptions(OrganizationStatus, {
      [OrganizationStatus.Active]: "Aktywna",
      [OrganizationStatus.Inactive]: "Nieaktywna",
      [OrganizationStatus.Dissolved]: "Rozwiązana",
      [OrganizationStatus.Unknown]: "Nieznany",
    }),
  },
];

const checkboxInputs: formCheckboxInputs[] = [
  {
    name: "isStrategic",
    label: "Czy jest kołem strategicznym?",
  },
];

export function Editor({
  initialData,
}: {
  initialData?: StudentOrganization | null;
}) {
  const defaultValues: StudentOrganizationFormValues = initialData ?? {
    ...(null as unknown as StudentOrganizationFormValues),
    departmentId: null,
    logoKey: null,
    coverKey: null,
    description: null,
    shortDescription: null,
    coverPreview: false, // cholera wi co to jest, te organizacje co są już na backendzie mają to zawsze na false
    isStrategic: false,
  };

  return (
    <AbstractEditor
      schema={StudentOrganizationSchema}
      defaultValues={defaultValues}
      createOnSubmit={createOnSubmit}
      editOnSubmit={editOnSubmit}
      imageInputs={imageInputs}
      textInputs={textInputs}
      richTextInput={richTextInput}
      selectInputs={selectInputs}
      checkboxInputs={checkboxInputs}
      returnButtonLabel="Wróć do organizacji"
    ></AbstractEditor>
  );
}
