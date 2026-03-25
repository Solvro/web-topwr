import Cookies from "js-cookie";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import type { SavedToast } from "../types/internal";
import { getSavedToastCookieOptions } from "./get-saved-toast-cookie-options";

/**
 * Saves a toast message in a browser cookie to be displayed on the next page render.
 * For use **outside** of React components, where the {@link useSavedToast} hook cannot be used.
 */
export const deferClientToast = (toast: SavedToast): void => {
  Cookies.set(SAVED_TOAST_COOKIE_NAME, ...getSavedToastCookieOptions(toast));
};
