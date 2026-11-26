import type { LOCALES } from "./constants";
import type messages from "./messages/pl.json";

export type Locale = (typeof LOCALES)[number];

export type LocaleMessages = typeof messages;
