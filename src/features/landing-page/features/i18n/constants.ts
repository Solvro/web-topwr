export const LOCALES = ["pl", "en"] as const;

export const DEFAULT_LOCALE = "pl";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const LOCALE_NAMES = {
  pl: "Polski",
  en: "English",
} as const satisfies Record<(typeof LOCALES)[number], string>;
