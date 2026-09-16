export enum Resource {
  AboutUs = "dashboard/about-us",
  AboutUsLinks = "dashboard/about-us/links",
  AcademicSemesters = "dashboard/academic-semesters",
  Aeds = "dashboard/map/aeds",
  Banners = "dashboard/banners",
  BicycleShowers = "dashboard/map/bicycle-showers",
  Buildings = "dashboard/map/buildings",
  CalendarEvents = "dashboard/calendar-events",
  Campuses = "dashboard/map/campuses",
  Changes = "dashboard/changes",
  ChangeScreenshots = "dashboard/change-screenshots",
  Contributors = "dashboard/about-us/contributors",
  ContributorSocialLinks = "dashboard/contributor-social-links",
  Das = "dashboard/das-config/das",
  DasConfig = "dashboard/das-config",
  DasFloors = "dashboard/das-config/das-floors",
  Dashboard = "dashboard",
  DasLinks = "dashboard/das-config/das-links",
  DasMaps = "dashboard/das-config/das-maps",
  DasOrganizations = "dashboard/das-config/das-organizations",
  DasStands = "dashboard/das-config/das-stands",
  DasTimetableEntries = "dashboard/das-config/das-timetable-entries",
  DasTimetables = "dashboard/das-config/das-timetables",
  DaySwaps = "dashboard/day-swaps",
  DepartmentLinks = "dashboard/department-links",
  Departments = "dashboard/departments",
  FoodSpots = "dashboard/map/food-spots",
  GuideArticles = "dashboard/guide-articles",
  GuideAuthors = "dashboard/guide-authors",
  GuideQuestions = "dashboard/guide-questions",
  Holidays = "dashboard/holidays",
  Libraries = "dashboard/map/libraries",
  Majors = "dashboard/majors",
  Map = "dashboard/map",
  Milestones = "dashboard/about-us/versions",
  MobileConfig = "dashboard/misc",
  Notifications = "dashboard/notifications",
  NotificationTopics = "dashboard/notifications/topics",
  PinkBoxes = "dashboard/map/pink-boxes",
  PolinkaStations = "dashboard/map/polinka-stations",
  RegularHours = "dashboard/regular-hours",
  Roles = "dashboard/about-us/roles",
  SksOpeningHours = "dashboard/misc/sks-opening-hours",
  SpecialHours = "dashboard/special-hours",
  StudentOrganizationLinks = "dashboard/student-organization-links",
  StudentOrganizations = "dashboard/student-organizations",
  StudentOrganizationTags = "dashboard/student-organization-tags",
  Versions = "dashboard/versions",
  VersionScreenshots = "dashboard/version-screenshots",
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
  /** e.g. One DAS can have one Timetable with the same ID */
  OneToOne = "one_to_one",
}
