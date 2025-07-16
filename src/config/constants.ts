import type { Department } from "@/types/app";

export const SOLVRO_WEBPAGE_URL = "https://solvro.pwr.edu.pl/pl/";

/** The URL to the base path of the external API, including the version, *without* a trailing slash. */
export const API_URL = (
  process.env.API_URL ?? "https://api.topwr.solvro.pl/api/v1"
).replace(/\/+$/, "");

export const UNIVERSITY_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: "Wydział Architektury",
  },
  {
    id: 2,
    name: "Wydział Budownictwa Lądowego i Wodnego",
  },
  {
    id: 4,
    name: "Wydział Chemiczny",
  },
  {
    id: 5,
    name: "Wydział Informatyki i Telekomunikacji",
  },
  {
    id: 6,
    name: "Wydział Elektryczny",
  },
  {
    id: 7,
    name: "Wydział Geoinżynierii, Górnictwa i Geologii",
  },
  {
    id: 8,
    name: "Wydział Inżynierii Środowiska",
  },
  {
    id: 9,
    name: "Wydział Zarządzania",
  },
  {
    id: 10,
    name: "Wydział Mechaniczno-Energetyczny",
  },
  {
    id: 11,
    name: "Wydział Mechaniczny",
  },
  {
    id: 12,
    name: "Wydział Podstawowych Problemów Techniki",
  },
  {
    id: 13,
    name: "Wydział Elektroniki, Fotoniki i Mikrosystemów",
  },
  {
    id: 14,
    name: "Wydział Matematyki",
  },
  {
    id: 15,
    name: "Wydział Medyczny",
  },
];

export const AUTH_STATE_COOKIE_NAME = "topwr_auth";

export const ERROR_CODES = {
  401: "Ta strona wymaga zalogowania",
  403: "Nie masz uprawnień do przeglądania tej strony",
  404: "Nie znaleziono podanej strony",
  500: "Wystąpił błąd serwera",
};

/** A map of API error codes to user-friendly messages */
export const ERROR_MESSAGES: Record<string, string> = {
  E_INVALID_CREDENTIALS: "Wpisano niepoprawny email lub hasło",
  E_UNEXPECTED_ERROR: "Nastąpił nieoczekiwany błąd",
  E_VALIDATION_ERROR: "Wpisane dane są niekompletne lub nieprawidłowe",
};
