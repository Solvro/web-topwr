import { LOCALES } from "../constants";
import type { Locale } from "../types";

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);
