import type {
  FormInputName,
  SortFiltersFormValuesNarrowed,
} from "@/types/forms";
import type { DeclinableNoun } from "@/types/polish";

import {
  ApplicationError,
  FilterType,
  GrammaticalCase,
  SortDirection,
} from "./enums";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

export const LIST_RESULTS_PER_PAGE = 10;

export const APPLICATION_ERROR_MESSAGES: Record<ApplicationError, string> = {
  [ApplicationError.Unauthorized]: "Ta strona wymaga zalogowania",
  [ApplicationError.Forbidden]: "Nie masz uprawnień do przeglądania tej strony",
  [ApplicationError.NotFound]: "Nie znaleziono podanej strony",
  [ApplicationError.ServerError]: "Wystąpił nieoczekiwany błąd serwera",
  [ApplicationError.NotImplemented]:
    "Ta strona nie jest jeszcze gotowa. Wróć tu za niedługo!",
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
  INVALID_TOPIC_NAME:
    "Niepoprawna nazwa. Dozwolone są tylko litery, cyfry oraz znaki - _ . ~ %",
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
  sortBy: GrammaticalCase.Genitive,
};

export const SORT_FILTER_DEFAULT_VALUES = {
  sortBy: null,
  sortDirection: SortDirection.Ascending,
  filters: [],
} satisfies SortFiltersFormValuesNarrowed;

export const UNFILTERABLE_INPUT_TYPES = new Set<FormInputName>(["imageInputs"]);

export const SORT_FILTER_PLACEHOLDER = "Wybierz pole";

/** The delimiter used to separate sort direction and sort by field. */
export const SORT_DIRECTION_SEPARATOR = ".";

export const FILTER_TYPE_MAPPINGS: Partial<Record<FormInputName, FilterType>> =
  {
    selectInputs: FilterType.Select,
    checkboxInputs: FilterType.Checkbox,
    relationInputs: FilterType.Relation,
  };

// #endregion

export const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

/** Used as the initially-selected color in the color picker input. */
export const DEFAULT_COLOR = "#ffffff";

export const CALENDAR_MAX_EVENTS_PER_DAY = 5;

/* Copied from https://github.com/Solvro/backend-topwr/blob/main/app/models/firebase_topic.ts */
export const TOPIC_NAME_REGEX = /^[a-zA-Z0-9-_.~%]{1,900}$/;
