import { getFutureDate } from "@/lib/helpers/calendar";
import type { ResourceMetadata } from "@/types/app";

import {
  DepartmentIds,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  RelatedResource,
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

/** A list of all resources which define an `order` field in the database. */
export const ORDERABLE_RESOURCES = [
  Resource.GuideArticles,
] satisfies Resource[];

/** Required metadata for each resource. */
export const RESOURCE_METADATA = {
  [Resource.GuideArticles]: {
    apiPath: "guide_articles",
    itemMapper: (item) => ({
      name: item.title,
      shortDescription: item.shortDesc,
    }),
    form: {
      inputs: {
        imageInputs: {
          imageKey: { label: "Zdjęcie" },
        },
        textInputs: {
          title: { label: "Tytuł" },
          shortDesc: { label: "Krótki opis" },
        },
        richTextInputs: { description: { label: "Opis" } },
        relationInputs: {
          [RelatedResource.GuideAuthors]: {
            name: "guideAuthors",
            apiPath: "guide_authors",
            displayField: "name",
          },
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
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.shortDescription,
    }),
    form: {
      inputs: {
        imageInputs: {
          logoKey: { label: "Logo" },
          coverKey: { label: "Baner" },
        },
        textInputs: { name: { label: "Nazwa" } },
        textareaInputs: { shortDescription: { label: "Krótki opis" } },
        richTextInputs: { description: { label: "Opis" } },
        selectInputs: {
          departmentId: {
            label: "Wydział",
            placeholder: "Wybierz wydział",
            optionEnum: DepartmentIds,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.DEPARTMENT,
          },
          source: {
            label: "Źródło",
            placeholder: "Wybierz źródło",
            optionEnum: OrganizationSource,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE,
          },
          organizationType: {
            label: "Typ",
            placeholder: "Wybierz typ",
            optionEnum: OrganizationType,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE,
          },
          organizationStatus: {
            label: "Status",
            placeholder: "Wybierz status",
            optionEnum: OrganizationStatus,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.STATUS,
          },
        },
        checkboxInputs: {
          isStrategic: { label: "Czy jest kołem strategicznym?" },
        },
        relationInputs: {
          [RelatedResource.StudentOrganizationLinks]: {
            name: "links",
            apiPath: "student_organization_links",
            displayField: "link",
          },
          [RelatedResource.StudentOrganizationTags]: {
            name: "tags",
            pk: "tag",
            apiPath: "student_organization_tags",
            displayField: "tag",
          },
        },
      },
      defaultValues: {
        name: "",
        departmentId: null,
        logoKey: null,
        coverKey: null,
        description: null,
        shortDescription: null,
        coverPreview: false, // czy używać covera jako zdjęcie podglądowe zamiast logo
        source: OrganizationSource.Manual,
        organizationType: OrganizationType.ScientificClub,
        organizationStatus: OrganizationStatus.Active,
        isStrategic: false,
        branch: "main", // filia/oddział Politechniki
      },
    },
  },
  [Resource.Banners]: {
    apiPath: "banners",
    itemMapper: (item) => ({
      id: item.id,
      name: item.title,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: {
          title: { label: "Tytuł" },
          url: { label: "URL" },
        },
        textareaInputs: { description: { label: "Opis" } },
        dateTimeInputs: {
          visibleFrom: { label: "Data rozpoczęcia" },
          visibleUntil: { label: "Data zakończenia" },
        },
        colorInputs: {
          titleColor: { label: "Kolor tytułu" },
          textColor: { label: "Kolor tekstu" },
          backgroundColor: { label: "Kolor tła" },
        },
        checkboxInputs: { draft: { label: "Wersja robocza" } },
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
  [Resource.CalendarEvents]: {
    apiPath: "event_calendar",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.location ?? "Brak lokalizacji",
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa wydarzenia" },
          location: { label: "Lokalizacja" },
          description: { label: "Opis wydarzenia" },
        },
        dateTimeInputs: {
          startTime: { label: "Czas rozpoczęcia" },
          endTime: { label: "Czas zakończenia" },
        },
      },
      defaultValues: {
        name: "",
        location: "",
        description: "",
        startTime: getFutureDate(1),
        endTime: getFutureDate(2),
      },
    },
  },
} satisfies {
  [R in Resource]: ResourceMetadata<R>;
};
