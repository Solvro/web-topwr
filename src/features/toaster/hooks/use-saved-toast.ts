import Cookies from "js-cookie";

import { logger } from "@/features/logging";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import { SavedToastSchema } from "../schemas/saved-toast-schema";
import type { SavedToast } from "../types/internal";
import { getSavedToastCookieOptions } from "../utils/get-saved-toast-cookie-options";

export const useSavedToast = (): {
  savedToast: SavedToast | null;
  deferToast: (toast: SavedToast) => void;
  deleteSavedToast: () => void;
} => {
  const deleteSavedToast = () => {
    Cookies.remove(SAVED_TOAST_COOKIE_NAME);
  };

  const deferToast = (toast: SavedToast) => {
    Cookies.set(SAVED_TOAST_COOKIE_NAME, ...getSavedToastCookieOptions(toast));
  };

  let savedToast: SavedToast | null = null;

  const toastCookie = Cookies.get(SAVED_TOAST_COOKIE_NAME);
  if (toastCookie != null && toastCookie.length > 0) {
    let parsedToast: unknown = null;
    try {
      parsedToast = JSON.parse(toastCookie);
    } catch (error) {
      logger.error(error, "Failed to parse saved toast");
      deleteSavedToast();
    }
    if (parsedToast != null) {
      const parseResult = SavedToastSchema.safeParse(parsedToast);
      if (parseResult.success) {
        savedToast = parseResult.data;
      } else {
        logger.error(parseResult.error, "Saved toast does not match schema");
        deleteSavedToast();
      }
    }
  }

  return { savedToast, deferToast, deleteSavedToast };
};
