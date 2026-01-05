export enum Resource {
  AboutUs = "about-us",
  AboutUsLinks = "about-us/links",
  AcademicSemesters = "academic-semesters",
  Aeds = "map/aeds",
  Banners = "banners",
  BicycleShowers = "map/bicycle-showers",
  Buildings = "map/buildings",
  CalendarEvents = "calendar-events",
  Campuses = "map/campuses",
  Changes = "changes",
  ChangeScreenshots = "change-screenshots",
  Contributors = "about-us/contributors",
  ContributorSocialLinks = "contributor-social-links",
  DaySwaps = "day-swaps",
  Departments = "departments",
  DepartmentLinks = "department-links",
  FoodSpots = "map/food-spots",
  GuideArticles = "guide-articles",
  GuideAuthors = "guide-authors",
  GuideQuestions = "guide-questions",
  Holidays = "holidays",
  Libraries = "map/libraries",
  Majors = "majors",
  Map = "map",
  Milestones = "about-us/versions",
  MobileConfig = "misc",
  Notifications = "notifications",
  NotificationTopics = "notifications/topics",
  PinkBoxes = "map/pink-boxes",
  PolinkaStations = "map/polinka-stations",
  RegularHours = "library-regular-hours",
  Roles = "about-us/roles",
  SksOpeningHours = "misc/sks-opening-hours",
  SpecialHours = "library-special-hours",
  StudentOrganizations = "student-organizations",
  StudentOrganizationLinks = "student-organization-links",
  StudentOrganizationTags = "student-organization-tags",
  Versions = "versions",
  VersionScreenshots = "version-screenshots",
}

export enum OrganizationType {
  ScientificClub = "scientific_club",
  StudentOrganization = "student_organization",
  StudentMedium = "student_medium",
  CultureAgenda = "culture_agenda",
  StudentCouncil = "student_council",
}

export enum OrganizationSource {
  StudentDepartment = "student_department",
  Manual = "manual",
  PwrActive = "pwr_active",
}

export enum OrganizationStatus {
  Active = "active",
  Inactive = "inactive",
  Dissolved = "dissolved",
  Unknown = "unknown",
}

export enum ChangeType {
  Feature = "FEATURE",
  Fix = "FIX",
}

/** Filia/oddział Politechniki */
export enum UniversityBranch {
  MainCampus = "main",
}

export enum Branch {
  Main = "main",
  JeleniaGora = "jelenia_gora",
  Walbrzych = "walbrzych",
  Legnica = "legnica",
}

export enum ExternalDigitalGuideMode {
  AppId = "APP_ID",
  Url = "URL",
}

// from https://github.com/Solvro/backend-topwr/blob/main/app/enums/link_type.ts
export enum LinkType {
  TopwrBuildings = "topwr:buildings",
  Phone = "tel",
  Mail = "mailto:",
  Default = "default",
  Facebook = "facebook",
  Instagram = "instagram",
  Discord = "discord",
  LinkedIn = "linkedin",
  GitHub = "github",
  X = "https://x.com",
  YouTube = "youtu",
  TikTok = "tiktok",
  Twitch = "twitch",
}

// from https://github.com/Solvro/backend-topwr/blob/main/app/enums/studies_type.ts
export enum StudiesType {
  FirstDegree = "1DEGREE",
  SecondDegree = "2DEGREE",
  LongCycle = "LONG_CYCLE",
}

// from https://github.com/Solvro/backend-topwr/blob/main/app/enums/guide_author_role.ts
export enum GuideAuthorRole {
  Author = "AUTHOR",
  Redactor = "REDACTOR",
}

export enum Language {
  Polish = "pl",
  English = "en",
}

export enum RelationType {
  /** e.g. Each student organization has many links, and the foreign key is stored on the related resource (links) */
  OneToMany = "one_to_many",

  /**
   * e.g. Each student organization has one department, but many organizations can share the same department;
   * the foreign key is stored on the main resource (student organizations)
   */
  ManyToOne = "many_to_one",
  /** e.g. Student organization tags: many-to-many relation without foreign keys in either resource (pivot table used) */
  ManyToMany = "many_to_many",
}
