import Cookies from "js-cookie";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import type { SavedToast } from "../types/internal";
import { getSavedToastCookieOptions } from "../utils/get-saved-toast-cookie-options";

const deferToast = (toast: SavedToast) => {
  Cookies.set(SAVED_TOAST_COOKIE_NAME, ...getSavedToastCookieOptions(toast));
};

// This is written as a hook to ensure usage in client components, as it is implemented using browser-side cookies
export const useSavedToast = (): {
  deferToast: (toast: SavedToast) => void;
} => {
  return { deferToast };
};
