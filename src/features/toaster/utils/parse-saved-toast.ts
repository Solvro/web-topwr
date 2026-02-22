import Cookies from "js-cookie";

import { logger } from "@/features/logging";

import { SAVED_TOAST_COOKIE_NAME } from "../constants";
import { SavedToastSchema } from "../schemas/saved-toast-schema";
import type { SavedToast } from "../types/internal";
import { deleteSavedToast } from "../utils/delete-saved-toast";

/** Parses the saved toast from the cookie. If the cookie is not present, invalid, or does not match the schema, deletes it and returns `null`. */
export const parseSavedToast = (): SavedToast | null => {
  const toastCookie = Cookies.get(SAVED_TOAST_COOKIE_NAME);
  if (toastCookie == null || toastCookie.length === 0) {
    return null;
  }
  let parsedToast: unknown = null;
  try {
    parsedToast = JSON.parse(toastCookie);
  } catch (error) {
    logger.error(error, "Failed to parse saved toast");
    deleteSavedToast();
    return null;
  }
  const parseResult = SavedToastSchema.safeParse(parsedToast);
  if (parseResult.success) {
    return parseResult.data;
  }
  logger.error(parseResult.error, "Saved toast does not match schema");
  deleteSavedToast();
  return null;
};
