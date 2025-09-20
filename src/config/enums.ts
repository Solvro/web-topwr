export enum Resource {
  GuideArticles = "guide_articles",
  StudentOrganizations = "student_organizations",
  Banners = "banners",
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

//from https://api.topwr.solvro.pl/api/v1/departments
export enum DepartmentIds {
  Architecture = 1,
  CivilEngineering = 2,
  Chemistry = 4,
  ComputerScienceAndTelecommunications = 5,
  ElectricalEngineering = 6,
  GeoengineeringMiningAndGeology = 7,
  EnvironmentalEngineering = 8,
  Management = 9,
  MechanicalAndPowerEngineering = 10,
  Mechanical = 11,
  FundamentalProblemsOfTechnology = 12,
  ElectronicsPhotonicsAndMicrosystems = 13,
  Mathematics = 14,
  Medical = 15,
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
