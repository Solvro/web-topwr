import { SendHorizonal } from "lucide-react";
import { lazy } from "react";

import { ImageType, Weekday } from "@/config/enums";
import { getRoundedDate } from "@/utils";

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
} from "../enums";
import type { ResourceMetadata } from "../types/internal";
import { POLISH_WEEKDAYS } from "@/features/polish";

// lazy import needed due to circular dependency
const NotificationConfirmationMessage = lazy(
  async () =>
    await import("../components/notification-confirmation-message").then(
      (module_) => ({ default: module_.NotificationConfirmationMessage }),
    ),
);

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
  GUIDE_ARTICLES: {
    AUTHOR_ROLES: {
      [GuideAuthorRole.Author]: "Autor",
      [GuideAuthorRole.Redactor]: "Redaktor",
    } satisfies Record<GuideAuthorRole, string>,
  },
  LINK_TYPE: {
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
  [Resource.AboutUs]: {
    apiPath: "about_us",
    apiVersion: 2,
    isSingleton: true,
    itemMapper: () => ({}),
    form: {
      inputs: {
        richTextInputs: {
          description: { label: "Opis" },
        },
        imageInputs: {
          coverPhotoKey: { label: "Zdjęcie w tle", type: ImageType.Banner },
        },
      },
      defaultValues: {
        description: "",
        coverPhotoKey: "",
      },
    },
  },
  [Resource.AboutUsLinks]: {
    apiPath: "about_us_links",
    itemMapper: (item) => ({
      name: item.linkType,
      shortDescription: item.link,
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
            optionLabels: SELECT_OPTION_LABELS.LINK_TYPE,
          },
        },
      },
      defaultValues: {
        link: "",
        linkType: LinkType.Default,
      },
    },
  },
  [Resource.AcademicSemesters]: {
    queryName: "academicCalendar",
    apiPath: "academic_calendars",
    itemMapper: (item) => ({
      name: item.name,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa semestru" },
        },
        dateInputs: {
          semesterStartDate: { label: "Data rozpoczęcia semestru" },
          examSessionStartDate: {
            label: "Data rozpoczęcia sesji egzaminacyjnej",
          },
          examSessionLastDate: {
            label: "Data zakończenia sesji egzaminacyjnej",
          },
        },
        checkboxInputs: {
          isFirstWeekEven: { label: "Czy pierwszy tydzień jest parzysty?" },
        },
        relationInputs: {
          [Resource.DaySwaps]: {
            type: RelationType.OneToMany,
            foreignKey: "academicCalendarId",
          },
          [Resource.Holidays]: {
            type: RelationType.OneToMany,
            foreignKey: "academicCalendarId",
          },
        },
      },
      defaultValues: {
        name: "",
        semesterStartDate: "",
        examSessionStartDate: "",
        examSessionLastDate: "",
        isFirstWeekEven: false,
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
        colorInputs: {
          accentColor: { label: "Kolor akcentu" },
        },
      },
      defaultValues: {
        name: "",
        location: "",
        description: "",
        startTime: getRoundedDate(0),
        endTime: getRoundedDate(24),
        accentColor: null,
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
        textInputs: { name: { label: "Nazwa" } },
        textareaInputs: { description: { label: "Opis" } },
        selectInputs: {
          type: {
            label: "Typ",
            optionEnum: ChangeType,
            optionLabels: SELECT_OPTION_LABELS.CHANGES.TYPE,
          },
        },
        relationInputs: {
          [Resource.ChangeScreenshots]: {
            type: RelationType.OneToMany,
            foreignKey: "changeId",
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
  [Resource.ChangeScreenshots]: {
    queryName: "screenshots",
    apiPath: "change_screenshots",
    itemMapper: (item) => ({
      name: item.subtitle ?? `Zdjęcie ${String(item.id)}`,
      shortDescription: null,
    }),
    form: {
      inputs: {
        textInputs: {
          subtitle: { label: "Podpis" },
        },
        imageInputs: {
          imageKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
      },
      defaultValues: {
        changeId: -1,
        imageKey: "",
        subtitle: null,
      },
    },
  },
  [Resource.Contributors]: {
    queryName: "contributors",
    apiPath: "contributors",
    orderable: true,
    itemMapper: (item) => ({
      name: item.name,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Imię i nazwisko" },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Logo },
        },
        relationInputs: {
          [Resource.ContributorSocialLinks]: {
            type: RelationType.OneToMany,
            foreignKey: "contributorId",
          },
        },
      },
      defaultValues: {
        name: "",
        photoKey: null,
      },
    },
  },
  [Resource.ContributorSocialLinks]: {
    queryName: "socialLinks",
    apiPath: "contributor_social_links",
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
            optionLabels: SELECT_OPTION_LABELS.LINK_TYPE,
          },
        },
      },
      defaultValues: {
        link: "",
        linkType: LinkType.Default,
        contributorId: -1,
      },
    },
  },
  [Resource.DaySwaps]: {
    queryName: "daySwaps",
    apiPath: "day_swaps",
    itemMapper: (item) => ({
      name: item.date,
    }),
    form: {
      inputs: {
        dateInputs: {
          date: { label: "Data" },
        },
        selectInputs: {
          changedWeekday: {
            label: "Zmieniony dzień tygodnia",
            optionEnum: Weekday,
            optionLabels: POLISH_WEEKDAYS,
          },
        },
        checkboxInputs: {
          changedDayIsEven: { label: "Czy zmieniony dzień jest parzysty?" },
        },
      },
      defaultValues: {
        date: "",
        changedWeekday: Weekday.Monday,
        changedDayIsEven: false,
        academicCalendarId: -1,
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
          logoKey: { label: "Logo", type: ImageType.Logo },
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
          [Resource.DepartmentLinks]: {
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
  [Resource.DepartmentLinks]: {
    queryName: "departmentLinks",
    apiPath: "department_links",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.link,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa" },
          link: { label: "Link" },
        },
        selectInputs: {
          linkType: {
            label: "Rodzaj linku",
            optionEnum: LinkType,
            optionLabels: SELECT_OPTION_LABELS.LINK_TYPE,
          },
        },
      },
      defaultValues: {
        link: "",
        name: "",
        linkType: LinkType.Default,
        departmentId: -1,
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
          imageKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        textInputs: {
          title: { label: "Tytuł" },
          shortDesc: { label: "Krótki opis" },
        },
        richTextInputs: { description: { label: "Opis" } },
        relationInputs: {
          [Resource.GuideQuestions]: {
            type: RelationType.OneToMany,
            foreignKey: "articleId",
          },
          [Resource.GuideAuthors]: {
            type: RelationType.ManyToMany,
            pivotData: {
              field: "role",
              optionEnum: GuideAuthorRole,
              optionLabels: SELECT_OPTION_LABELS.GUIDE_ARTICLES.AUTHOR_ROLES,
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
  [Resource.GuideQuestions]: {
    queryName: "guideQuestions",
    apiPath: "guide_questions",
    itemMapper: (item) => ({
      name: item.title,
      shortDescription: item.answer,
    }),
    form: {
      inputs: {
        textInputs: {
          title: { label: "Pytanie" },
        },
        richTextInputs: {
          answer: { label: "Odpowiedź" },
        },
      },
      defaultValues: {
        title: "",
        answer: "",
        articleId: -1,
      },
    },
  },
  [Resource.Holidays]: {
    queryName: "holidays",
    apiPath: "holidays",
    itemMapper: (item) => ({
      name: item.description,
      shortDescription: `${item.startDate} - ${item.lastDate}`,
    }),
    form: {
      inputs: {
        textareaInputs: {
          description: { label: "Opis" },
        },
        dateInputs: {
          startDate: { label: "Data rozpoczęcia" },
          lastDate: { label: "Data zakończenia" },
        },
      },
      defaultValues: {
        startDate: "",
        lastDate: "",
        description: "",
        academicCalendarId: -1,
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
        relationInputs: {
          [Resource.Contributors]: {
            type: RelationType.ManyToMany,
            pivotData: {
              field: "role_id",
              relatedResource: Resource.Roles,
            },
          },
        },
      },
      defaultValues: {
        name: "",
      },
    },
  },
  [Resource.Notifications]: {
    apiPath: "firebase/broadcast",
    isSingleton: true,
    itemMapper: (item) => ({
      name: item.notification.title,
      shortDescription: item.notification.body,
    }),
    form: {
      inputs: {
        textInputs: {
          "notification.title": { label: "Tytuł powiadomienia" },
          "notification.body": { label: "Treść powiadomienia" },
        },
        arrayInputs: {
          topics: {
            label: "Kategorie",
            itemsResource: Resource.NotificationTopics,
          },
        },
      },
      defaultValues: {
        notification: {
          title: "",
          body: "",
        },
        topics: [],
      },
      submitConfiguration: {
        create: {
          submitLabel: "Wyślij",
          submitIcon: SendHorizonal,
          confirmationMessage: {
            title: "Czy na pewno chcesz wysłać to powiadomienie?",
            description: NotificationConfirmationMessage,
          },
        },
      },
    },
  },
  [Resource.NotificationTopics]: {
    apiPath: "firebase/topics",
    pk: "topicName",
    deletable: false,
    itemMapper: (item) => ({
      name: item.topicName,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: {
          topicName: { label: "Nazwa", immutable: true },
          description: { label: "Opis" },
        },
      },
      defaultValues: {
        topicName: "",
        description: null,
        isActive: true,
        deactivatedAt: null,
      },
    },
  },
  [Resource.Roles]: {
    queryName: "roles",
    apiPath: "roles",
    itemMapper: (item) => ({
      name: item.name,
    }),
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa roli" },
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
          logoKey: { label: "Logo", type: ImageType.Logo },
          coverKey: { label: "Baner", type: ImageType.Banner },
        },
        textInputs: {
          name: { label: "Nazwa" },
          enName: { label: "Nazwa (ang.)" },
        },
        textareaInputs: {
          shortDescription: { label: "Krótki opis" },
          enShortDescription: { label: "Krótki opis (ang.)" },
        },
        richTextInputs: {
          description: { label: "Opis" },
          enDescription: { label: "Opis (ang.)" },
        },
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
          coverPreview: { label: "Używaj banera jako zdjęcia podglądowego?" },
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
        enName: null,
        enDescription: null,
        enShortDescription: null,
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
            optionLabels: SELECT_OPTION_LABELS.LINK_TYPE,
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
  [Resource.Versions]: {
    apiPath: "versions",
    itemMapper: (item) => ({
      name: item.name,
      shortDescription: item.description,
    }),
    form: {
      inputs: {
        textInputs: { name: { label: "Nazwa" } },
        textareaInputs: { description: { label: "Opis" } },
        dateInputs: { releaseDate: { label: "Data publikacji" } },
        relationInputs: {
          [Resource.Changes]: {
            type: RelationType.OneToMany,
            foreignKey: "versionId",
          },
          [Resource.Milestones]: {
            type: RelationType.ManyToOne,
            foreignKey: "milestoneId",
          },
          [Resource.VersionScreenshots]: {
            type: RelationType.OneToMany,
            foreignKey: "versionId",
          },
        },
      },
      defaultValues: {
        name: "",
        description: null,
        releaseDate: getRoundedDate(0),
        milestoneId: -1,
      },
    },
  },
  [Resource.VersionScreenshots]: {
    queryName: "screenshots",
    apiPath: "version_screenshots",
    itemMapper: (item) => ({
      name: item.subtitle ?? `Zdjęcie ${String(item.id)}`,
      shortDescription: null,
    }),
    form: {
      inputs: {
        textInputs: {
          subtitle: { label: "Podpis" },
        },
        imageInputs: {
          imageKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
      },
      defaultValues: {
        versionId: -1,
        imageKey: "",
        subtitle: null,
      },
    },
  },
} as const satisfies {
  [R in Resource]: ResourceMetadata<R>;
};
