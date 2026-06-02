import type { SavedToast } from "../types/internal";
import { setSavedToastCookie } from "./get-saved-toast-cookie";

/**
 * Saves a toast message in a browser cookie to be displayed on the next page render.
 * For use **outside** of React components, where the {@link useSavedToast} hook cannot be used.
 */
export const deferClientToast = (toast: SavedToast): void => {
  setSavedToastCookie(toast);
};
