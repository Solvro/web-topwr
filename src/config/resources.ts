import type { DefaultValues } from "react-hook-form";

import { enumToFormSelectOptions } from "@/lib/helpers";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type { AbstractResourceFormInputs } from "@/types/forms";

import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "./enums";

const SELECT_OPTION_LABELS = {
  STUDENT_ORGANIZATIONS: {
    DEPARTMENT: {
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
    },
    SOURCE: {
      [OrganizationSource.StudentDepartment]: "Dział Studencki",
      [OrganizationSource.Manual]: "Ręcznie",
      [OrganizationSource.PwrActive]: "PWR Active",
    },
    TYPE: {
      [OrganizationType.ScientificClub]: "Koło naukowe",
      [OrganizationType.StudentOrganization]: "Organizacja studencka",
      [OrganizationType.StudentMedium]: "Organizacja medialna",
      [OrganizationType.CultureAgenda]: "Organizacja kulturalna",
      [OrganizationType.StudentCouncil]: "Samorząd studencki",
    },
    STATUS: {
      [OrganizationStatus.Active]: "Aktywna",
      [OrganizationStatus.Inactive]: "Nieaktywna",
      [OrganizationStatus.Dissolved]: "Rozwiązana",
      [OrganizationStatus.Unknown]: "Nieznany",
    },
  },
};

/**
 * Metadata for each resource.
 *
 * apiPath - A mapping of the client-side resources to their paths in the backend API.
 *           Currently they are the same, but this allows for flexibility in the website paths.
 *
 * form.inputs - The inputs to be used in the form for the resource.
 *
 * form.defaultValues - The default values to be used in the form for the resource.
 *
 */
export const RESOURCE_METADATA: {
  [R in Resource]: {
    apiPath: string;
    form: {
      inputs: AbstractResourceFormInputs<R>;
      defaultValues: DefaultValues<ResourceFormValues<R> | ResourceDataType<R>>;
    };
  };
} = {
  [Resource.GuideArticles]: {
    apiPath: "guide_articles",
    form: {
      inputs: {
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
      },
      defaultValues: {
        title: "",
        imageKey: "",
        description: "",
        shortDesc: "",
      },
    },
  },
  [Resource.StudentOrganizations]: {
    apiPath: "student_organizations",
    form: {
      inputs: {
        imageInputs: [
          {
            label: "Logo",
            name: "logoKey",
          },
          {
            label: "Baner",
            name: "coverKey",
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
      },
      defaultValues: {
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
      },
    },
  },
};
