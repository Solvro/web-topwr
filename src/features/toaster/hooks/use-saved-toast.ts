import type { SavedToast } from "../types/internal";
import { setSavedToastCookie } from "../utils/get-saved-toast-cookie";

const deferToast = (toast: SavedToast) => {
  setSavedToastCookie(toast);
};

// This is written as a hook to ensure usage in client components, as it is implemented using browser-side cookies
export const useSavedToast = (): {
  deferToast: (toast: SavedToast) => void;
} => {
  return { deferToast };
};
