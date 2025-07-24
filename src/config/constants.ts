import {
  DepartmentIds,
  GrammaticalGender,
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
} from "@/config/enums";
import { removeTrailingSlash } from "@/lib/helpers";
import type { Declensions, Pluralized } from "@/types/app";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

/** The URL to the base path of the external API, including the version, *without* a trailing slash. */
export const API_URL = removeTrailingSlash(
  process.env.API_URL ?? "https://test.api.topwr.solvro.pl/api/v1",
);

/** The URL to the base path of the external API file uploads directory, *without* a trailing slash. */
export const API_FILES_URL = removeTrailingSlash(
  // TODO: add test. prefix to default value once backend fixes it
  process.env.API_FILES_URL ?? "https://api.topwr.solvro.pl/uploads",
);

/**
 * A mapping of the client-side resources to their paths in the backend API.
 * Currently they are the same, but this allows for flexibility in the website paths.
 */
export const RESOURCE_API_PATHS = {
  [Resource.GuideArticles]: "guide_articles",
  [Resource.StudentOrganizations]: "student_organizations",
} as const;

export const LIST_RESULTS_PER_PAGE = 10;

export const AUTH_STATE_COOKIE_NAME = "topwr_auth";

export const ERROR_CODES = {
  401: "Ta strona wymaga zalogowania",
  403: "Nie masz uprawnień do przeglądania tej strony",
  404: "Nie znaleziono podanej strony",
  500: "Wystąpił błąd serwera",
};

/** A map of API error codes to user-friendly messages */
export const API_ERROR_MESSAGES: Record<string, string> = {
  E_INVALID_CREDENTIALS: "Wpisano niepoprawny email lub hasło",
  E_UNEXPECTED_ERROR: "Nastąpił nieoczekiwany błąd",
  E_VALIDATION_ERROR: "Wpisane dane są niekompletne lub nieprawidłowe",
};

export const FORM_ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  NONEMPTY: "To pole jest wymagane",
  INVALID_EMAIL: "Niepoprawny adres email",
};

export const SELECT_OPTION_LABELS = {
  STUDENT_ORGANIZATIONS: {
    DEPARTMENT: {
      [DepartmentIds.Architecture]: "Wydział Architektury",
      [DepartmentIds.CivilEngineering]:
        "Wydział Budownictwa Lądowego i Wodnego",
      [DepartmentIds.Chemistry]: "Wydział Chemiczny",
      [DepartmentIds.ComputerScienceAndTelecommunications]:
        "Wydział Informatyki i Telekomunikacji",
      [DepartmentIds.ElectricalEngineering]: "Wydział Elektryczny",
      [DepartmentIds.GeoengineeringMiningAndGeology]:
        "Wydział Geoinżynierii, Górnictwa i Geologii",
      [DepartmentIds.EnvironmentalEngineering]: "Wydział Inżynierii Środowiska",
      [DepartmentIds.Management]: "Wydział Zarządzania",
      [DepartmentIds.MechanicalAndPowerEngineering]:
        "Wydział Mechaniczno-Energetyczny",
      [DepartmentIds.Mechanical]: "Wydział Mechaniczny",
      [DepartmentIds.FundamentalProblemsOfTechnology]:
        "Wydział Podstawowych Problemów Techniki",
      [DepartmentIds.ElectronicsPhotonicsAndMicrosystems]:
        "Wydział Elektroniki, Fotoniki i Mikrosystemów",
      [DepartmentIds.Mathematics]: "Wydział Matematyki",
      [DepartmentIds.Medical]: "Wydział Medyczny",
    },
    SOURCE: {
      [OrganizationSource.StudentDepartment]: "Dział Studencki",
      [OrganizationSource.Manual]: "Ręcznie",
      [OrganizationSource.PwrActive]: "PWR Active",
    },
    TYPE: {
      [OrganizationType.ScientificClub]: "Koło naukowe",
      [OrganizationType.StudentOrganization]: "Organizacja studencka",
      [OrganizationType.StudentMedium]: "Organizacja medialna",
      [OrganizationType.CultureAgenda]: "Organizacja kulturalna",
      [OrganizationType.StudentCouncil]: "Samorząd studencki",
    },
    STATUS: {
      [OrganizationStatus.Active]: "Aktywna",
      [OrganizationStatus.Inactive]: "Nieaktywna",
      [OrganizationStatus.Dissolved]: "Rozwiązana",
      [OrganizationStatus.Unknown]: "Nieznany",
    },
  },
};

/** A dictionary of Polish language declensions of all resource names, as well as their genders for use with determiners. */
export const RESOURCE_DECLENSIONS: Pluralized<
  Record<Resource, { gender: GrammaticalGender } & Declensions>
> = {
  singular: {
    [Resource.GuideArticles]: {
      gender: GrammaticalGender.Masculine,
      nominative: "artykuł",
      genitive: "artykułu",
      dative: "artykułowi",
      accusative: "artykuł",
      instrumental: "artykułem",
      locative: "artykule",
      vocative: "artykule",
    },
    [Resource.StudentOrganizations]: {
      gender: GrammaticalGender.Feminine,
      nominative: "organizacja studencka",
      genitive: "organizacji studenckiej",
      dative: "organizacji studenckiej",
      accusative: "organizację studencką",
      instrumental: "organizacją studencką",
      locative: "organizacji studenckiej",
      vocative: "organizacjo studencka",
    },
  },
  plural: {
    [Resource.GuideArticles]: {
      gender: GrammaticalGender.Masculine,
      nominative: "artykuły",
      genitive: "artykułów",
      dative: "artykułom",
      accusative: "artykuły",
      instrumental: "artykułami",
      locative: "artykułach",
      vocative: "artykuły",
    },
    [Resource.StudentOrganizations]: {
      gender: GrammaticalGender.Feminine,
      nominative: "organizacje studenckie",
      genitive: "organizacji studenckich",
      dative: "organizacjom studenckim",
      accusative: "organizacje studenckie",
      instrumental: "organizacjami studenckimi",
      locative: "organizacjach studenckich",
      vocative: "organizacje studenckie",
    },
  },
};

/** A static dictionary of declensions for determiners in the Polish language. */
export const DETERMINER_DECLENSIONS: Pluralized<
  Record<GrammaticalGender, Declensions>
> = {
  singular: {
    [GrammaticalGender.Masculine]: {
      nominative: "ten",
      genitive: "tego",
      dative: "temu",
      accusative: "ten",
      instrumental: "tym",
      locative: "tym",
      vocative: "ten",
    },
    [GrammaticalGender.Feminine]: {
      nominative: "ta",
      genitive: "tej",
      dative: "tej",
      accusative: "tę",
      instrumental: "tą",
      locative: "tej",
      vocative: "ta",
    },
    [GrammaticalGender.Neuter]: {
      nominative: "to",
      genitive: "tego",
      dative: "temu",
      accusative: "to",
      instrumental: "tym",
      locative: "tym",
      vocative: "to",
    },
  },
  plural: {
    [GrammaticalGender.Masculine]: {
      nominative: "ci",
      genitive: "tych",
      dative: "tym",
      accusative: "tych",
      instrumental: "tymi",
      locative: "tych",
      vocative: "ci",
    },
    [GrammaticalGender.Feminine]: {
      nominative: "te",
      genitive: "tych",
      dative: "tym",
      accusative: "te",
      instrumental: "tymi",
      locative: "tych",
      vocative: "te",
    },
    [GrammaticalGender.Neuter]: {
      nominative: "te",
      genitive: "tych",
      dative: "tym",
      accusative: "te",
      instrumental: "tymi",
      locative: "tych",
      vocative: "te",
    },
  },
};
