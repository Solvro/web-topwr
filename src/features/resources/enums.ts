export enum Resource {
  AboutUs = "about_us",
  AboutUsLinks = "about_us_links",
  Banners = "banners",
  CalendarEvents = "calendar_events",
  Changes = "changes",
  ChangeScreenshots = "change_screenshots",
  Contributors = "contributors",
  ContributorSocialLinks = "contributor_social_links",
  Departments = "departments",
  DepartmentLinks = "department_links",
  GuideArticles = "guide_articles",
  GuideAuthors = "guide_authors",
  GuideQuestions = "guide_questions",
  Notifications = "notifications",
  NotificationTopics = "notification_topics",
  Roles = "roles",
  StudentOrganizations = "student_organizations",
  StudentOrganizationLinks = "student_organization_links",
  StudentOrganizationTags = "student_organization_tags",
  Majors = "majors",
  Milestones = "milestones",
  Versions = "versions",
  VersionScreenshots = "version_screenshots",
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
