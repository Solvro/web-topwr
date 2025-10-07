import { getErrorMessage } from "@/lib/error-handling";
import { removeTrailingSlash } from "@/lib/helpers/transformations";
import type { AuthState } from "@/types/api";
import type {
  Declensions,
  DeclinableNoun,
  SortDirection,
  SortFiltersOptions,
} from "@/types/app";

import { DeclensionCase } from "./enums";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

const TEST_API_BASE = "https://test.api.topwr.solvro.pl";

/** The URL to the base path of the external API, including the version, *without* a trailing slash. */
export const API_URL = removeTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL ?? `${TEST_API_BASE}/api/v1`,
);

/** The URL to the base path of the external API file uploads directory, *without* a trailing slash. */
export const API_FILES_URL = removeTrailingSlash(
  process.env.NEXT_PUBLIC_API_FILES_URL ?? `${TEST_API_BASE}/uploads`,
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

export const SORT_DIRECTIONS = {
  asc: "rosnącej",
  desc: "malejącej",
} satisfies Record<SortDirection, string>;

export const IMPLICIT_SORT_BY_ATTRIBUTES = [
  "createdAt",
  "updatedAt",
] satisfies DeclinableNoun[];

export const SORT_FILTER_LABEL_DECLENSION_CASES = {
  sortBy: DeclensionCase.Genitive,
  searchField: DeclensionCase.Locative,
};

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: "",
  sortDirection: "asc",
  searchField: "",
  searchTerm: "",
} satisfies SortFiltersOptions;

export const SORT_FILTER_PLACEHOLDER = "wybierz pole";

export const TOAST_MESSAGES = {
  login: {
    loading: "Trwa logowanie...",
    success: (response: AuthState) =>
      `Pomyślnie zalogowano jako ${response.user.fullName ?? response.user.email}!`,
    error: (error: unknown) =>
      getErrorMessage(error, "Nastąpił błąd podczas logowania"),
  },
  object: (declensions: Declensions) => ({
    read: {
      error: `Wystąpił nieoczekiwany błąd podczas wczytywania ${declensions.genitive}. Spróbuj ponownie później.`,
    },
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

export const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

/** Used as the initially-selected color in the color picker input. */
export const DEFAULT_COLOR = "#ffffff";

export const CALENDAR_MAX_EVENTS_PER_DAY = 5;
