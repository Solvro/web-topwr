import { getFutureDate } from "@/lib/helpers/calendar";
import type { ResourceMetadata } from "@/types/app";

import {
  ChangeType,
  GuideAuthorRole,
  LinkType,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  RelationType,
  Resource,
  StudiesType,
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
  CHANGES: {
    TYPE: {
      [ChangeType.Feature]: "Funkcjonalność",
      [ChangeType.Fix]: "Fix",
    },
  },
  MAJORS: {
    STUDIES_TYPE: {
      [StudiesType.FirstDegree]: "Studia I stopnia",
      [StudiesType.SecondDegree]: "Studia II stopnia",
      [StudiesType.LongCycle]: "Studia jednolite magisterskie",
    } satisfies Record<StudiesType, string>,
  },
};

/** Required metadata for each resource. */
export const RESOURCE_METADATA = {
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
  [Resource.Departments]: {
    apiPath: "departments",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: `${item.code} (${item.betterCode})`,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa" },
          code: { label: "Kod wydziału (z numerem)" },
          betterCode: { label: "Kod wydziału (ze skrótem)" },
          addressLine1: { label: "Adres - linia 1" },
          addressLine2: { label: "Adres - linia 2" },
        },
        imageInputs: {
          logoKey: { label: "Logo" },
        },
        richTextInputs: { description: { label: "Opis" } },
        colorInputs: {
          gradientStart: { label: "Kolor początkowy gradientu" },
          gradientStop: { label: "Kolor końcowy gradientu" },
        },
        relationInputs: {
          [Resource.Majors]: {
            type: RelationType.OneToMany,
            foreignKey: "departmentId",
          },
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
        gradientStart: null,
        gradientStop: null,
        branch: UniversityBranch.MainCampus,
      },
    },
  },
  [Resource.GuideArticles]: {
    apiPath: "guide_articles",
    orderable: true,
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
          [Resource.GuideAuthors]: {
            type: RelationType.ManyToMany,
            pivotData: {
              role: GuideAuthorRole.Author,
            },
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
  [Resource.GuideAuthors]: {
    queryName: "guideAuthors",
    apiPath: "guide_authors",
    itemMapper: (item) => ({
      name: item.name,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Imię i nazwisko" },
        },
      },
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
            optionEnum: OrganizationSource,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.SOURCE,
          },
          organizationType: {
            label: "Typ",
            optionEnum: OrganizationType,
            optionLabels: SELECT_OPTION_LABELS.STUDENT_ORGANIZATIONS.TYPE,
          },
          organizationStatus: {
            label: "Status",
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
            label: "Rodzaj linku",
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
  [Resource.Majors]: {
    apiPath: "fields_of_study",
    queryName: "fieldsOfStudy",
    itemMapper: (item) => ({
      name: `${item.name} (${SELECT_OPTION_LABELS.MAJORS.STUDIES_TYPE[item.studiesType]})`,
      shortDescription: item.url,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa kierunku" },
          url: { label: "URL kierunku" },
        },
        selectInputs: {
          studiesType: {
            label: "Typ studiów",
            optionEnum: StudiesType,
            optionLabels: SELECT_OPTION_LABELS.MAJORS.STUDIES_TYPE,
          },
        },
        checkboxInputs: {
          isEnglish: { label: "Zajęcia w j. angielskim" },
          hasWeekendOption: { label: "Możliwość studiów weekendowych" },
        },
      },
      defaultValues: {
        name: "",
        url: null,
        isEnglish: false,
        studiesType: StudiesType.FirstDegree,
        hasWeekendOption: false,
        departmentId: -1,
      },
    },
  },
  [Resource.Versions]: {
    apiPath: "versions",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: { name: { label: "Nazwa wersji" } },
        textareaInputs: { description: { label: "Opis wersji" } },
        dateInputs: { releaseDate: { label: "Data" } },
        relationInputs: {
          [Resource.Changes]: {
            type: RelationType.OneToMany,
            foreignKey: "versionId",
          },
          [Resource.Milestones]: {
            type: RelationType.ManyToOne,
            foreignKey: "milestoneId",
          },
        },
      },
      defaultValues: {
        name: "",
        description: null,
        releaseDate: new Date().toISOString(),
        milestoneId: Number.NaN,
      },
    },
  },
  [Resource.Changes]: {
    queryName: "changes",
    apiPath: "changes",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: { name: { label: "Nazwa zmiany" } },
        textareaInputs: { description: { label: "Opis zmiany" } },
        selectInputs: {
          type: {
            label: "Typ",
            optionEnum: ChangeType,
            optionLabels: SELECT_OPTION_LABELS.CHANGES.TYPE,
          },
        },
      },
      defaultValues: {
        name: "",
        description: "",
        versionId: -1,
        type: ChangeType.Feature,
      },
    },
  },
  [Resource.Milestones]: {
    queryName: "milestones",
    apiPath: "milestones",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: "",
    }),
    form: {
      inputs: {
        textInputs: { name: { label: "Nazwa" } },
      },
      defaultValues: {
        name: "",
      },
    },
  },
} as const satisfies {
  [R in Resource]: ResourceMetadata<R>;
};
