import {
  Bath,
  Bell,
  BellPlus,
  BookOpen,
  Building,
  Calendar,
  CalendarCog,
  CircleQuestionMark,
  Clock,
  Library,
  Link,
  Map,
  Megaphone,
  Notebook,
  ScrollText,
  SendHorizonal,
  ShieldUser,
  Slice,
  SquareActivity,
  Train,
  University,
  UsersRound,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { lazy } from "react";

import { DEFAULT_INPUT_COLOR } from "@/config/constants";
import { ImageType, Weekday } from "@/config/enums";
import { POLISH_WEEKDAYS } from "@/features/polish";
import { getRoundedDate } from "@/utils";

import {
  ChangeType,
  ExternalDigitalGuideMode,
  GuideAuthorRole,
  Language,
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
  SKS_OPENING_HOURS: {
    LANGUAGE: {
      [Language.Polish]: "Polski",
      [Language.English]: "Angielski",
    },
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
  MAP: {
    BRANCH: {
      [UniversityBranch.Main]: "Kampus główny",
      [UniversityBranch.JeleniaGora]: "Jelenia Góra",
      [UniversityBranch.Walbrzych]: "Wałbrzych",
      [UniversityBranch.Legnica]: "Legnica",
    } satisfies Record<UniversityBranch, string>,
    EXTERNAL_GUIDE_MODE: {
      [ExternalDigitalGuideMode.AppId]: "ID aplikacji",
      [ExternalDigitalGuideMode.Url]: "URL",
    } satisfies Record<ExternalDigitalGuideMode, string>,
  },
};

/** Default coordinates for Wrocław University of Science and Technology */
const DEFAULT_COORDINATES = {
  latitude: 51.107_883,
  longitude: 17.038_538,
} as const;

/** Common address input configuration */
const ADDRESS_LINE_INPUTS = {
  addressLine1: { label: "Adres — linia 1" },
  addressLine2: { label: "Adres — linia 2" },
} as const;

/** Required metadata for each resource. */
export const RESOURCE_METADATA = {
  [Resource.AboutUs]: {
    apiPath: "about_us",
    apiVersion: 2,
    isSingleton: true,
    itemMapper: () => ({}),
    icon: CircleQuestionMark,
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
      description: item.link,
    }),
    icon: Link,
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
    icon: CalendarCog,
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
            dateFields: ["date"],
          },
          [Resource.Holidays]: {
            type: RelationType.OneToMany,
            foreignKey: "academicCalendarId",
            dateFields: ["startDate", "lastDate"],
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
      description: item.description,
    }),
    icon: Megaphone,
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
      description: item.location ?? "Brak lokalizacji",
    }),
    icon: Calendar,
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
      description: item.description,
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
    icon: UsersRound,
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
      description: item.linkType,
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
            label: "Na jaki dzień tygodnia zmiana?",
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
      description: `${item.code} (${item.betterCode})`,
    }),
    icon: University,
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa" },
          code: { label: "Kod wydziału (z numerem)" },
          betterCode: { label: "Kod wydziału (ze skrótem)" },
          ...ADDRESS_LINE_INPUTS,
        },
        imageInputs: {
          logoKey: { label: "Logo", type: ImageType.Logo },
        },
        richTextInputs: { description: { label: "Opis" } },
        colorInputs: {
          gradientStart: { label: "Kolor początkowy gradientu" },
          gradientStop: { label: "Kolor końcowy gradientu" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
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
        logoKey: null,
        gradientStart: DEFAULT_INPUT_COLOR,
        gradientStop: DEFAULT_INPUT_COLOR,
        branch: UniversityBranch.Main,
      },
    },
  },
  [Resource.DepartmentLinks]: {
    queryName: "departmentLinks",
    apiPath: "department_links",
    itemMapper: (item) => ({
      name: item.name,
      description: item.link,
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
      description: item.shortDesc,
    }),
    icon: BookOpen,
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
    orderable: true,
    itemMapper: (item) => ({
      name: item.title,
      description: item.answer,
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
      description: `${item.startDate} - ${item.lastDate}`,
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
      description: item.url,
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
    }),
    icon: ScrollText,
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
  [Resource.MobileConfig]: {
    apiPath: "mobile_config",
    isSingleton: true,
    itemMapper: () => ({}),
    icon: Wrench,
    form: {
      inputs: {
        numberInputs: {
          daySwapLookahead: { label: "Horyzont czasowy zamiany dni" },
        },
        bumpInputs: {
          cmsReferenceNumber: {
            label: "Numer referencyjny CMS",
            bumpPath: "cms",
          },
          translatorReferenceNumber: {
            label: "Numer referencyjny tłumaczeń",
            bumpPath: "translator",
          },
        },
      },
      defaultValues: {
        cmsReferenceNumber: -1,
        daySwapLookahead: -1,
        translatorReferenceNumber: -1,
      },
    },
  },
  [Resource.Notifications]: {
    apiPath: "firebase/broadcast",
    isSingleton: true,
    itemMapper: (item) => ({
      name: item.notification.title,
      description: item.notification.body,
    }),
    icon: Bell,
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
    showItemId: false,
    itemMapper: (item) => ({
      name: item.topicName,
      description: item.description,
    }),
    icon: BellPlus,
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
    icon: ShieldUser,
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
  [Resource.SksOpeningHours]: {
    apiPath: "sks_opening_hours",
    pk: "language",
    itemMapper: (item) => ({
      name: SELECT_OPTION_LABELS.SKS_OPENING_HOURS.LANGUAGE[item.language],
      description: `${item.canteen} | ${item.cafe}`,
    }),
    icon: Clock,
    form: {
      inputs: {
        textInputs: {
          canteen: { label: "Godziny otwarcia stołówki" },
          cafe: { label: "Godziny otwarcia kawiarni" },
        },
        selectInputs: {
          language: {
            label: "Język",
            optionEnum: Language,
            optionLabels: SELECT_OPTION_LABELS.SKS_OPENING_HOURS.LANGUAGE,
          },
        },
      },
      defaultValues: {
        canteen: "",
        cafe: "",
        language: null as unknown as Language,
      },
    },
  },
  [Resource.StudentOrganizations]: {
    apiPath: "student_organizations",
    itemMapper: (item) => ({
      name: item.name,
      description: item.shortDescription,
    }),
    icon: Building,
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
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
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
        branch: UniversityBranch.Main,
      },
    },
  },
  [Resource.StudentOrganizationLinks]: {
    queryName: "links",
    apiPath: "student_organization_links",
    itemMapper: (item) => ({
      name: item.link,
      description: item.linkType,
    }),
    form: {
      inputs: {
        textInputs: {
          link: { label: "Link" },
          name: { label: "Nazwa" },
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
      description: item.description,
    }),
    icon: Notebook,
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
  [Resource.Campuses]: {
    apiPath: "campuses",
    itemMapper: (item) => ({
      name: item.name,
      description: SELECT_OPTION_LABELS.MAP.BRANCH[item.branch],
    }),
    icon: Map,
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa kampusu" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          coverKey: { label: "Zdjęcie okładki", type: ImageType.Banner },
        },
      },
      defaultValues: {
        name: "",
        coverKey: null,
        branch: UniversityBranch.Main,
      },
    },
  },
  [Resource.Buildings]: {
    apiPath: "buildings",
    itemMapper: (item) => ({
      name: item.identifier,
      descriptor: item.specialName,
      description: item.addressLine1,
    }),
    icon: Building,
    form: {
      inputs: {
        textInputs: {
          identifier: { label: "Identyfikator budynku (np. A1, C13)" },
          specialName: { label: "Specjalna nazwa budynku" },
          ...ADDRESS_LINE_INPUTS,
          externalDigitalGuideIdOrUrl: {
            label: "ID lub URL zewnętrznego przewodnika",
          },
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
          externalDigitalGuideMode: {
            label: "Tryb przewodnika cyfrowego",
            optionEnum: ExternalDigitalGuideMode,
            optionLabels: SELECT_OPTION_LABELS.MAP.EXTERNAL_GUIDE_MODE,
          },
        },
        checkboxInputs: {
          haveFood: { label: "Czy budynek ma miejsca z jedzeniem?" },
        },
        imageInputs: {
          coverKey: { label: "Zdjęcie okładki", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Campuses]: {
            type: RelationType.ManyToOne,
            foreignKey: "campusId",
          },
        },
      },
      defaultValues: {
        identifier: "",
        specialName: null,
        campusId: null,
        addressLine1: "",
        addressLine2: null,
        ...DEFAULT_COORDINATES,
        haveFood: false,
        branch: UniversityBranch.Main,
        coverKey: null,
        externalDigitalGuideMode: null,
        externalDigitalGuideIdOrUrl: null,
      },
    },
  },
  [Resource.BicycleShowers]: {
    apiPath: "bicycle_showers",
    itemMapper: (item) => ({
      name: item.room ?? "Prysznic rowerowy",
      description: item.addressLine1 ?? null,
    }),
    icon: Bath,
    form: {
      inputs: {
        textInputs: {
          room: { label: "Numer pokoju/pomieszczenia" },
          ...ADDRESS_LINE_INPUTS,
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        textareaInputs: {
          instructions: { label: "Instrukcje użytkowania" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Buildings]: {
            type: RelationType.ManyToOne,
            foreignKey: "buildingId",
          },
        },
      },
      defaultValues: {
        room: null,
        instructions: null,
        ...DEFAULT_COORDINATES,
        addressLine1: null,
        addressLine2: null,
        branch: UniversityBranch.Main,
        photoKey: null,
        buildingId: null,
      },
    },
  },
  [Resource.Aeds]: {
    apiPath: "aeds",
    itemMapper: (item) => ({
      name: "Defibrylator AED",
      description: item.addressLine1 ?? null,
    }),
    icon: SquareActivity,
    form: {
      inputs: {
        textInputs: {
          ...ADDRESS_LINE_INPUTS,
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        textareaInputs: {
          instructions: { label: "Instrukcje użytkowania" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Buildings]: {
            type: RelationType.ManyToOne,
            foreignKey: "buildingId",
          },
        },
      },
      defaultValues: {
        ...DEFAULT_COORDINATES,
        addressLine1: null,
        addressLine2: null,
        branch: UniversityBranch.Main,
        instructions: null,
        photoKey: null,
        buildingId: null,
      },
    },
  },
  [Resource.FoodSpots]: {
    apiPath: "food_spots",
    itemMapper: (item) => ({
      name: item.name,
      description: item.addressLine1 ?? null,
    }),
    icon: UtensilsCrossed,
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa miejsca" },
          ...ADDRESS_LINE_INPUTS,
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Buildings]: {
            type: RelationType.ManyToOne,
            foreignKey: "buildingId",
          },
        },
      },
      defaultValues: {
        name: "",
        addressLine1: null,
        addressLine2: null,
        ...DEFAULT_COORDINATES,
        branch: UniversityBranch.Main,
        photoKey: null,
        buildingId: null,
      },
    },
  },
  [Resource.Map]: {
    // Map is a grouping resource for navigation, not an actual data resource
    apiPath: "map",
    itemMapper: () => ({ name: "Mapa" }),
    icon: Map,
    form: {
      inputs: {},
      defaultValues: {},
    },
  },
  [Resource.Libraries]: {
    apiPath: "libraries",
    itemMapper: (item) => ({
      name: item.title,
      description: item.addressLine1 ?? null,
    }),
    icon: Library,
    form: {
      inputs: {
        textInputs: {
          title: { label: "Nazwa biblioteki" },
          room: { label: "Numer pokoju" },
          ...ADDRESS_LINE_INPUTS,
          phone: { label: "Numer telefonu" },
          email: { label: "Adres email" },
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Buildings]: {
            type: RelationType.ManyToOne,
            foreignKey: "buildingId",
          },
          [Resource.RegularHours]: {
            type: RelationType.OneToMany,
            foreignKey: "libraryId",
          },
          [Resource.SpecialHours]: {
            type: RelationType.OneToMany,
            foreignKey: "libraryId",
          },
        },
      },
      defaultValues: {
        title: "",
        room: null,
        addressLine1: null,
        addressLine2: null,
        phone: null,
        email: null,
        ...DEFAULT_COORDINATES,
        branch: UniversityBranch.Main,
        photoKey: null,
        buildingId: null,
      },
    },
  },
  [Resource.RegularHours]: {
    apiPath: "library_regular_hours",
    itemMapper: (item) => ({
      name: POLISH_WEEKDAYS[item.weekDay],
      description: `${item.openTime} - ${item.closeTime}`,
    }),
    form: {
      inputs: {
        selectInputs: {
          weekDay: {
            label: "Dzień tygodnia",
            optionEnum: Weekday,
            optionLabels: POLISH_WEEKDAYS,
          },
        },
        timeInputs: {
          openTime: { label: "Godzina otwarcia" },
          closeTime: { label: "Godzina zamknięcia" },
        },
        relationInputs: {
          [Resource.Libraries]: {
            type: RelationType.ManyToOne,
            foreignKey: "libraryId",
          },
        },
      },
      defaultValues: {
        weekDay: Weekday.Monday,
        openTime: "08:00",
        closeTime: "16:00",
        libraryId: -1,
      },
    },
  },
  [Resource.SpecialHours]: {
    apiPath: "library_special_hours",
    itemMapper: (item) => ({
      name: item.specialDate,
      description: `${item.openTime} - ${item.closeTime}`,
    }),
    form: {
      inputs: {
        dateInputs: {
          specialDate: { label: "Specjalna data" },
        },
        timeInputs: {
          openTime: { label: "Godzina otwarcia" },
          closeTime: { label: "Godzina zamknięcia" },
        },
        relationInputs: {
          [Resource.Libraries]: {
            type: RelationType.ManyToOne,
            foreignKey: "libraryId",
          },
        },
      },
      defaultValues: {
        specialDate: getRoundedDate(0),
        openTime: "08:00",
        closeTime: "16:00",
        libraryId: -1,
      },
    },
  },
  [Resource.PinkBoxes]: {
    apiPath: "pink_boxes",
    itemMapper: (item) => ({
      name: item.roomOrNearby ?? "Różowa skrzynka",
      description: item.floor ?? null,
    }),
    icon: Slice,
    form: {
      inputs: {
        textInputs: {
          roomOrNearby: { label: "Numer pokoju lub opis lokalizacji" },
          floor: { label: "Piętro" },
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Buildings]: {
            type: RelationType.ManyToOne,
            foreignKey: "buildingId",
          },
        },
      },
      defaultValues: {
        roomOrNearby: null,
        floor: null,
        ...DEFAULT_COORDINATES,
        branch: UniversityBranch.Main,
        photoKey: null,
        buildingId: null,
      },
    },
  },
  [Resource.PolinkaStations]: {
    apiPath: "polinka_stations",
    itemMapper: (item) => ({
      name: item.name,
      description: item.addressLine1,
    }),
    icon: Train,
    form: {
      inputs: {
        textInputs: {
          name: { label: "Nazwa stacji" },
          ...ADDRESS_LINE_INPUTS,
          externalDigitalGuideIdOrUrl: {
            label: "ID lub URL zewnętrznego przewodnika",
          },
        },
        numberInputs: {
          latitude: { label: "Szerokość geograficzna" },
          longitude: { label: "Długość geograficzna" },
        },
        selectInputs: {
          branch: {
            label: "Filia",
            optionEnum: UniversityBranch,
            optionLabels: SELECT_OPTION_LABELS.MAP.BRANCH,
          },
          externalDigitalGuideMode: {
            label: "Tryb przewodnika cyfrowego",
            optionEnum: ExternalDigitalGuideMode,
            optionLabels: SELECT_OPTION_LABELS.MAP.EXTERNAL_GUIDE_MODE,
          },
        },
        imageInputs: {
          photoKey: { label: "Zdjęcie", type: ImageType.Banner },
        },
        relationInputs: {
          [Resource.Campuses]: {
            type: RelationType.ManyToOne,
            foreignKey: "campusId",
          },
        },
      },
      defaultValues: {
        name: "",
        campusId: null,
        addressLine1: "",
        addressLine2: null,
        ...DEFAULT_COORDINATES,
        branch: UniversityBranch.Main,
        photoKey: null,
        externalDigitalGuideMode: null,
        externalDigitalGuideIdOrUrl: null,
      },
    },
  },
} as const satisfies {
  [R in Resource]: ResourceMetadata<R>;
};
