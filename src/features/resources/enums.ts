export enum Resource {
  AboutUs = "admin/about-us",
  AboutUsLinks = "admin/about-us/links",
  AcademicSemesters = "admin/academic-semesters",
  Aeds = "admin/map/aeds",
  Banners = "admin/banners",
  BicycleShowers = "admin/map/bicycle-showers",
  Buildings = "admin/map/buildings",
  CalendarEvents = "admin/calendar-events",
  Campuses = "admin/map/campuses",
  Changes = "admin/changes",
  ChangeScreenshots = "admin/change-screenshots",
  Contributors = "admin/about-us/contributors",
  ContributorSocialLinks = "admin/contributor-social-links",
  Dashboard = "admin",
  DaySwaps = "admin/day-swaps",
  Departments = "admin/departments",
  DepartmentLinks = "admin/department-links",
  FoodSpots = "admin/map/food-spots",
  GuideArticles = "admin/guide-articles",
  GuideAuthors = "admin/guide-authors",
  GuideQuestions = "admin/guide-questions",
  Holidays = "admin/holidays",
  Libraries = "admin/map/libraries",
  Majors = "admin/majors",
  Map = "admin/map",
  Milestones = "admin/about-us/versions",
  MobileConfig = "admin/misc",
  Notifications = "admin/notifications",
  NotificationTopics = "admin/notifications/topics",
  PinkBoxes = "admin/map/pink-boxes",
  PolinkaStations = "admin/map/polinka-stations",
  RegularHours = "admin/regular-hours",
  Roles = "admin/about-us/roles",
  SksOpeningHours = "admin/misc/sks-opening-hours",
  SpecialHours = "admin/special-hours",
  StudentOrganizations = "admin/student-organizations",
  StudentOrganizationLinks = "admin/student-organization-links",
  StudentOrganizationTags = "admin/student-organization-tags",
  Versions = "admin/versions",
  VersionScreenshots = "admin/version-screenshots",
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

/** Filia Politechniki */
export enum UniversityBranch {
  Main = "main",
  JeleniaGora = "jelenia_gora",
  Walbrzych = "walbrzych",
  Legnica = "legnica",
}

export enum ExternalDigitalGuideMode {
  WebUrl = "web_url",
  DigitalGuideBuilding = "digital_guide_building",
  OtherDigitalGuidePlace = "other_digital_guide_place",
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
