import { getErrorMessage } from "@/lib/error-handling";
import { toTitleCase } from "@/lib/helpers";
import type { AuthState } from "@/types/api";
import type {
  AbstractResourceFormInputs,
  SortFiltersFormValues,
} from "@/types/forms";
import type { Declensions, DeclinableNoun } from "@/types/polish";

import { ApplicationError, DeclensionCase, SortDirection } from "./enums";
import type { Resource } from "./enums";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

export const LIST_RESULTS_PER_PAGE = 10;

export const AUTH_STATE_COOKIE_NAME = "topwr_auth";

export const APPLICATION_ERROR_MESSAGES: Record<ApplicationError, string> = {
  [ApplicationError.Unauthorized]: "Ta strona wymaga zalogowania",
  [ApplicationError.Forbidden]: "Nie masz uprawnień do przeglądania tej strony",
  [ApplicationError.NotFound]: "Nie znaleziono podanej strony",
  [ApplicationError.ServerError]: "Wystąpił nieoczekiwany błąd serwera",
};

/** A map of API error codes to user-friendly messages */
export const API_ERROR_MESSAGES: Record<string, string> = {
  E_INVALID_CREDENTIALS: "Wpisano niepoprawny email lub hasło",
  E_UNEXPECTED_ERROR: "Nastąpił nieoczekiwany błąd",
  E_VALIDATION_ERROR: "Wpisane dane są niekompletne lub nieprawidłowe",
  E_NOT_FOUND: "Nie znaleziono podanego zasobu",
};

export const FORM_ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  NONEMPTY: "To pole jest wymagane",
  INVALID_EMAIL: "Niepoprawny adres email",
  CONDITIONALLY_REQUIRED: "Należy wypełnić oba pola lub żadne z nich",
  INVALID_DEPARTMENT_CODE:
    "Niepoprawny kod wydziału. Musi zaczynać się od litery 'W' i zawierać 1-2 cyfry.",
  INVALID_DEPARTMENT_BETTER_CODE:
    "Niepoprawny kod wydziału. Musi zawierać tylko duże litery i zaczynać się od 'W'.",
};

// #region Sort filter constants

export const SORT_DIRECTION_NAMES = {
  asc: "rosnącej",
  desc: "malejącej",
} satisfies Record<SortDirection, string>;

export const IMPLICIT_SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
] satisfies DeclinableNoun[];

export const SORT_FILTER_LABEL_DECLENSION_CASES = {
  sortBy: DeclensionCase.Genitive,
};

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: null,
  sortDirection: SortDirection.Ascending,
  filters: [],
} satisfies SortFiltersFormValues;

export const UNFILTERABLE_INPUT_TYPES = new Set<
  keyof AbstractResourceFormInputs<Resource>
>(["imageInputs"]);

export const SORT_FILTER_PLACEHOLDER = "Wybierz pole";

/** The delimiter used to separate sort direction and sort by field. */
export const SORT_DIRECTION_SEPARATOR = ".";

// #endregion

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
    toggleArchived: (isArchived: boolean) => ({
      loading: `Trwa ${isArchived ? "archiwizowanie" : "przywracanie"} ${declensions.genitive}...`,
      success: `${toTitleCase(declensions.nominative)} została ${isArchived ? "zarchiwizowana" : "przywrócona"}.`,
      error: `Nie udało się ${isArchived ? "zarchiwizować" : "przywrócić"} ${declensions.genitive}`,
    }),
  }),
};

export const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

/** Used as the initially-selected color in the color picker input. */
export const DEFAULT_COLOR = "#ffffff";

export const CALENDAR_MAX_EVENTS_PER_DAY = 5;
