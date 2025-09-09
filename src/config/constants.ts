import { GrammaticalGender, Resource } from "@/config/enums";
import { getErrorMessage } from "@/lib/error-handling";
import { removeTrailingSlash } from "@/lib/helpers";
import type { AuthState } from "@/types/api";
import type { Declensions, Pluralized, RecordIntersection } from "@/types/app";

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
  CONDITIONALLY_REQUIRED: "Należy wypełnić oba pola lub żadne z nich",
};

/** A dictionary of Polish language declensions of all resource names & other nouns, as well as their genders for use with determiners. */
export const NOUN_DECLENSIONS = {
  [Resource.GuideArticles]: {
    gender: GrammaticalGender.Masculine,
    singular: {
      nominative: "artykuł",
      genitive: "artykułu",
      dative: "artykułowi",
      accusative: "artykuł",
      instrumental: "artykułem",
      locative: "artykule",
      vocative: "artykule",
    },
    plural: {
      nominative: "artykuły",
      genitive: "artykułów",
      dative: "artykułom",
      accusative: "artykuły",
      instrumental: "artykułami",
      locative: "artykułach",
      vocative: "artykuły",
    },
  },
  [Resource.StudentOrganizations]: {
    gender: GrammaticalGender.Feminine,
    singular: {
      nominative: "organizacja studencka",
      genitive: "organizacji studenckiej",
      dative: "organizacji studenckiej",
      accusative: "organizację studencką",
      instrumental: "organizacją studencką",
      locative: "organizacji studenckiej",
      vocative: "organizacjo studencka",
    },
    plural: {
      nominative: "organizacje studenckie",
      genitive: "organizacji studenckich",
      dative: "organizacjom studenckim",
      accusative: "organizacje studenckie",
      instrumental: "organizacjami studenckimi",
      locative: "organizacjach studenckich",
      vocative: "organizacje studenckie",
    },
  },
  zdjęcie: {
    gender: GrammaticalGender.Neuter,
    singular: {
      nominative: "zdjęcie",
      genitive: "zdjęcia",
      dative: "zdjęciu",
      accusative: "zdjęcie",
      instrumental: "zdjęciem",
      locative: "zdjęciu",
      vocative: "zdjęcie",
    },
    plural: {
      nominative: "zdjęcia",
      genitive: "zdjęć",
      dative: "zdjęciom",
      accusative: "zdjęcia",
      instrumental: "zdjęciami",
      locative: "zdjęciach",
      vocative: "zdjęcia",
    },
  },
} satisfies RecordIntersection<
  Resource,
  string,
  { gender: GrammaticalGender } & Pluralized<Declensions>
>;

/** A static dictionary of declensions for determiners in the Polish language. */
export const DETERMINER_DECLENSIONS: Record<
  GrammaticalGender,
  Pluralized<Declensions>
> = {
  [GrammaticalGender.Masculine]: {
    singular: {
      nominative: "ten",
      genitive: "tego",
      dative: "temu",
      accusative: "ten",
      instrumental: "tym",
      locative: "tym",
      vocative: "ten",
    },
    plural: {
      nominative: "ci",
      genitive: "tych",
      dative: "tym",
      accusative: "tych",
      instrumental: "tymi",
      locative: "tych",
      vocative: "ci",
    },
  },
  [GrammaticalGender.Feminine]: {
    singular: {
      nominative: "ta",
      genitive: "tej",
      dative: "tej",
      accusative: "tę",
      instrumental: "tą",
      locative: "tej",
      vocative: "ta",
    },
    plural: {
      nominative: "te",
      genitive: "tych",
      dative: "tym",
      accusative: "te",
      instrumental: "tymi",
      locative: "tych",
      vocative: "te",
    },
  },
  [GrammaticalGender.Neuter]: {
    singular: {
      nominative: "to",
      genitive: "tego",
      dative: "temu",
      accusative: "to",
      instrumental: "tym",
      locative: "tym",
      vocative: "to",
    },
    plural: {
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

export const SORT_DIRECTIONS: Record<string, string> = {
  asc: "rosnącej",
  desc: "malejącej",
};

export const IMPLICIT_SORT_BY_ATTRIBUTES = {
  id: "identyfikatora",
  createdAt: "daty utworzenia",
  updatedAt: "daty ostatniej aktualizacji",
} as const;

export const TOAST_MESSAGES = {
  login: {
    loading: "Trwa logowanie...",
    success: (response: AuthState) =>
      `Pomyślnie zalogowano jako ${response.user.fullName ?? response.user.email}!`,
    error: (error: unknown) =>
      getErrorMessage(error, "Nastąpił błąd podczas logowania"),
  },
  object: (declensions: Declensions) => ({
    modify: {
      loading: "Trwa przetwarzanie...",
      success: "Pomyślnie zapisano!",
      error: "Wystąpił błąd podczas zapisywania.",
    },
    delete: {
      loading: `Trwa usuwanie ${declensions.genitive}...`,
      success: `Pomyślnie usunięto ${declensions.accusative}`,
      error: `Wystąpił błąd podczas usuwania ${declensions.genitive}`,
    },
    upload: {
      loading: `Trwa przesyłanie ${declensions.genitive}...`,
      success: `Pomyślnie przesłano ${declensions.accusative}!`,
      error: `Wystąpił błąd podczas przesyłania ${declensions.genitive}`,
    },
  }),
};
