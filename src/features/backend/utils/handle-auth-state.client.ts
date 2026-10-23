"use client";

import { forceLogout, refreshAccessToken } from "@/features/authentication";
import {
  getAuthStateNode,
  getTokenStatus,
} from "@/features/authentication/node";

/**
 * Client-only wrapper that checks auth state and handles token refresh/logout.
 * Throws if the session has expired and logout was triggered.
 * Must only be called in a browser context.
 */
export async function handleAuthState(): Promise<void> {
  const authState = getAuthStateNode();
  if (authState == null) {
    return;
  }

  const status = getTokenStatus(authState);
  switch (status) {
    case "both-expired": {
      forceLogout();
      throw new Error("Session expired");
    }
    case "expired": {
      const refreshedAuthState = await refreshAccessToken();
      if (refreshedAuthState == null) {
        forceLogout();
        throw new Error("Session expired");
      }
      break;
    }
    case "expiring-soon": {
      void refreshAccessToken().then((refreshedAuthState) => {
        if (refreshedAuthState == null) {
          forceLogout();
        }
      });
      break;
    }
    case "ok": {
      break;
    }
  }
}
