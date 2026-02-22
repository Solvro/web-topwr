import type { CookieOptions } from "@/types/cookies";

import { SavedToastSchema } from "../schemas/saved-toast-schema";
import type { SavedToast } from "../types/internal";

export const getSavedToastCookieOptions = (
  toast: SavedToast,
): [string, CookieOptions] => {
  // force errors to be thrown if the schema is updated without appropriate changes to the code
  const savedToast = SavedToastSchema.parse(toast);
  return [JSON.stringify(savedToast), { sameSite: "lax" }];
};
