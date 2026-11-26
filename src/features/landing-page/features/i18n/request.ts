/* eslint-disable import/no-default-export */
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "./constants";
import enMessages from "./messages/en.json";
import plMessages from "./messages/pl.json";
import { isLocale } from "./utils/is-locale";

const MESSAGES = { pl: plMessages, en: enMessages };

async function getHeaderLocale() {
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  if (acceptLanguage == null || acceptLanguage.trim() === "") {
    return DEFAULT_LOCALE;
  }
  return acceptLanguage.trim().toLowerCase().startsWith("pl") ? "pl" : "en";
}

async function getRequestLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(localeCookie)) {
    return localeCookie;
  }
  return await getHeaderLocale();
}

export default getRequestConfig(async () => {
  const locale = await getRequestLocale();
  return {
    locale,
    timeZone: "Europe/Warsaw",
    messages: MESSAGES[locale],
  };
});
