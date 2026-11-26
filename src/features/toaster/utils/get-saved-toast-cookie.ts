import Cookies from "js-cookie";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import type { SavedToast } from "../types/internal";
import { getSavedToastCookieOptions } from "./get-saved-toast-cookie-options";

export const setSavedToastCookie = (toast: SavedToast): void => {
  Cookies.set(SAVED_TOAST_COOKIE_NAME, ...getSavedToastCookieOptions(toast));
};
