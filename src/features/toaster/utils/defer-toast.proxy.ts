import type { NextResponse } from "next/server";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import type { SavedToast } from "../types/internal";
import { getSavedToastCookieOptions } from "./get-saved-toast-cookie-options";

/** Saves a toast message in a cookie to be displayed on the next page render. */
export const deferToastProxy = (response: NextResponse, toast: SavedToast) => {
  response.cookies.set(
    SAVED_TOAST_COOKIE_NAME,
    ...getSavedToastCookieOptions(toast),
  );
};
