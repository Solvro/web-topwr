import Cookies from "js-cookie";

import { deferClientToast } from "@/features/toaster";

// import { getToastMessages } from "@/lib/get-toast-messages";

import { AUTH_STATE_COOKIE_NAME } from "../constants";

/**
 * Clears the local auth state, saves a deferred toast, and redirects to the
 * login page. Must only be called in a browser context.
 */
export function forceLogout(): void {
  Cookies.remove(AUTH_STATE_COOKIE_NAME);
  deferClientToast({
    level: "warning",
    // TODO: Resolve the circular dependency issue to get the message from getToastMessages.auth.sessionExpired,
    message: "Twoja sesja wygasła. Proszę zalogować się ponownie.",
  });
  window.location.href = "/login";
}
