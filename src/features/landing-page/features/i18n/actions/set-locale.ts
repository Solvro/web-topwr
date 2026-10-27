"use server";

import { cookies } from "next/headers";

import { LOCALE_COOKIE_NAME } from "../constants";
import type { Locale } from "../types";
import { isLocale } from "../utils/is-locale";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    sameSite: "lax",
  });
}
