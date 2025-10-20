import { getFutureDate } from "@/lib/helpers/calendar";
import type { ResourceMetadata } from "@/types/app";

import {
  LinkType,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  RelationType,
  Resource,
  UniversityBranch,
} from "./enums";

const SELECT_OPTION_LABELS = {
  STUDENT_ORGANIZATIONS: {
    SOURCE: {
      [OrganizationSource.StudentDepartment]: "Dział Studencki",
      [OrganizationSource.Manual]: "Ręcznie",
      [OrganizationSource.PwrActive]: "PWR Active",
    } satisfies Record<OrganizationSource, string>,
    TYPE: {
      [OrganizationType.ScientificClub]: "Koło naukowe",
      [OrganizationType.StudentOrganization]: "Organizacja studencka",
      [OrganizationType.StudentMedium]: "Organizacja medialna",
      [OrganizationType.CultureAgenda]: "Organizacja kulturalna",
      [OrganizationType.StudentCouncil]: "Samorząd studencki",
    } satisfies Record<OrganizationType, string>,
    STATUS: {
      [OrganizationStatus.Active]: "Aktywna",
      [OrganizationStatus.Inactive]: "Nieaktywna",
      [OrganizationStatus.Dissolved]: "Rozwiązana",
      [OrganizationStatus.Unknown]: "Nieznany",
    } satisfies Record<OrganizationStatus, string>,
  },
  STUDENT_ORGANIZATION_LINKS: {
    TYPE: {
      [LinkType.Default]: "Strona internetowa",
      [LinkType.Discord]: "Discord",
      [LinkType.Facebook]: "Facebook",
      [LinkType.Instagram]: "Instagram",
      [LinkType.LinkedIn]: "LinkedIn",
      [LinkType.YouTube]: "YouTube",
      [LinkType.TikTok]: "TikTok",
      [LinkType.TopwrBuildings]: "Budynek ToPWR",
      [LinkType.Phone]: "Numer telefonu",
      [LinkType.Mail]: "Adres e-mail",
      [LinkType.GitHub]: "GitHub",
      [LinkType.X]: "X (dawniej Twitter)",
      [LinkType.Twitch]: "Twitch",
    } satisfies Record<LinkType, string>,
  },
};

/** A list of all resources which define an `order` field in the database. */
export const ORDERABLE_RESOURCES = [
  Resource.GuideArticles,
] satisfies Resource[];

/** Required metadata for each resource. */
export const RESOURCE_METADATA = {
  [Resource.Departments]: {
    apiPath: "departments",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa" },
          code: { label: "Kod wydziału (z numerem)" },
          betterCode: { label: "Kod wydziału (ze skrótem)" },
        },
        textareaInputs: {
          addressLine1: { label: "Adres - linia 1" },
          addressLine2: { label: "Adres - linia 2" },
        },
        imageInputs: {
          logoKey: { label: "Logo" },
        },
        richTextInputs: { description: { label: "Opis" } },
        colorInputs: {
          gradientStart: { label: "Kolor początkowy gradientu" },
          gradientEnd: { label: "Kolor końcowy gradientu" },
        },
      },
      defaultValues: {
        name: "",
        addressLine1: "",
        addressLine2: "",
        description: null,
        code: "",
        betterCode: "",
        logoKey: "",
        gradientStart: "",
        gradientEnd: "",
        branch: UniversityBranch.MainCampus,
      },
    },
  },
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
          [Resource.GuideAuthors]: { type: RelationType.ManyToMany },
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
  [Resource.GuideAuthors]: {
    queryName: "guideAuthors",
    apiPath: "guide_authors",
    itemMapper: (item) => ({
      name: item.name,
    }),
    form: {
      inputs: {},
      defaultValues: {
        name: "",
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
          [Resource.Departments]: {
            type: RelationType.ManyToOne,
            foreignKey: "departmentId",
          },
          [Resource.StudentOrganizationLinks]: {
            type: RelationType.OneToMany,
            foreignKey: "studentOrganizationId",
          },
          [Resource.StudentOrganizationTags]: { type: RelationType.ManyToMany },
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
        branch: UniversityBranch.MainCampus,
      },
    },
  },
  [Resource.StudentOrganizationLinks]: {
    queryName: "links",
    apiPath: "student_organization_links",
    itemMapper: (item) => ({
      name: item.link,
      shortDescription: item.linkType,
    }),
    form: {
      inputs: {
        textInputs: {
          link: { label: "Link" },
        },
        selectInputs: {
          linkType: {
            label: "Typ linku",
            placeholder: "Wybierz rodzaj linku",
            optionEnum: LinkType,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATION_LINKS.TYPE,
          },
        },
      },
      defaultValues: {
        link: "",
        linkType: LinkType.Default,
        studentOrganizationId: -1,
      },
    },
  },
  [Resource.StudentOrganizationTags]: {
    queryName: "tags",
    pk: "tag",
    apiPath: "student_organization_tags",
    itemMapper: (item) => ({
      name: item.tag,
    }),
    form: {
      inputs: {
        textInputs: {
          tag: { label: "Tag" },
        },
      },
      defaultValues: {
        tag: "",
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
} as const satisfies {
  [R in Resource]: ResourceMetadata<R>;
};
