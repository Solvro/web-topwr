export enum Resource {
  Departments = "departments",
  GuideArticles = "guide_articles",
  GuideAuthors = "guide_authors",
  StudentOrganizations = "student_organizations",
  StudentOrganizationLinks = "student_organization_links",
  StudentOrganizationTags = "student_organization_tags",
  Banners = "banners",
  CalendarEvents = "calendar_events",
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

// #region Polish language enums

export enum GrammaticalGender {
  Neuter = 0,
  Masculine = 1,
  Feminine = 2,
}

export enum DeclensionCase {
  Nominative = "nominative", // Mianownik - kto? co?
  Genitive = "genitive", // Dopełniacz - kogo? czego?
  Dative = "dative", // Celownik - komu? czemu?
  Accusative = "accusative", // Biernik - kogo? co?
  Instrumental = "instrumental", // Narzędnik - z kim? z czym?
  Locative = "locative", // Miejscownik - o kim? o czym?
  Vocative = "vocative", // Wołacz - o!
}

// #endregion

export enum RelationType {
  ManyToOne = "many_to_one",
  ManyToMany = "many_to_many",
}
