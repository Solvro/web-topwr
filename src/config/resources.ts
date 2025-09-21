import type { DefaultValues } from "react-hook-form";

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
      defaultValues: ResourceFormValues<R> &
        DefaultValues<ResourceFormValues<R> | ResourceDataType<R>>;
    };
  };
} = {
  [Resource.GuideArticles]: {
    apiPath: "guide_articles",
    form: {
      inputs: {
        imageInputs: [{ label: "Zdjęcie", name: "imageKey" }],

        textInputs: [
          { name: "title", label: "Tytuł" },
          { name: "shortDesc", label: "Krótki opis" },
        ],

        richTextInputs: [{ name: "description", label: "Opis" }],
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
          { label: "Logo", name: "logoKey" },
          { label: "Baner", name: "coverKey" },
        ],

        textInputs: [
          { name: "name", label: "Nazwa" },
          { name: "shortDescription", label: "Krótki opis" },
        ],

        richTextInputs: [{ name: "description", label: "Opis" }],

        selectInputs: [
          {
            name: "departmentId",
            label: "Wydział",
            placeholder: "Wybierz wydział",
            optionEnum: DepartmentIds,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT,
          },
          {
            name: "source",
            label: "Źródło",
            placeholder: "Wybierz źródło",
            optionEnum: OrganizationSource,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE,
          },
          {
            name: "organizationType",
            label: "Typ",
            placeholder: "Wybierz typ",
            optionEnum: OrganizationType,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE,
          },
          {
            name: "organizationStatus",
            label: "Status",
            placeholder: "Wybierz status",
            optionEnum: OrganizationStatus,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.STATUS,
          },
        ],
        checkboxInputs: [
          { name: "isStrategic", label: "Czy jest kołem strategicznym?" },
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
        branch: "main", // ????? wymagane ale w bazie jest zawsze 'main'
      },
    },
  },
  [Resource.Banners]: {
    apiPath: "banners",
    form: {
      inputs: {
        textInputs: [
          { name: "title", label: "Tytuł" },
          { name: "description", label: "Opis" },
          { name: "url", label: "URL" },
        ],
        dateInputs: [
          { name: "visibleFrom", label: "Data rozpoczęcia" },
          { name: "visibleUntil", label: "Data zakończenia" },
        ],
        colorInputs: [
          { name: "titleColor", label: "Kolor tytułu" },
          { name: "textColor", label: "Kolor tekstu" },
          { name: "backgroundColor", label: "Kolor tła" },
        ],
        checkboxInputs: [
          { name: "draft", label: "Wersja robocza" },
          { name: "shouldRender", label: "Wyświetlaj użytkownikom" },
        ],
      },
      defaultValues: {
        title: "",
        description: "",
        url: "",
        visibleFrom: null,
        visibleUntil: null,
        titleColor: null,
        textColor: null,
        backgroundColor: null,
        draft: true,
        shouldRender: false,
      },
    },
  },
};
