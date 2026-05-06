import type { AuthState } from "../types/internal";
import { doRefreshToken } from "./do-refresh-token";
import { getAuthStateNode } from "./get-auth-state.node";

/** Singleton promise – prevents concurrent refresh requests from stacking. */
let pendingRefresh: Promise<AuthState | null> | null = null;

/**
 * Requests a new access token using the stored refresh token.
 * Concurrent calls are de-duplicated – all callers share one in-flight request.
 * Must only be called in a browser context.
 */
export async function refreshAccessToken(): Promise<AuthState | null> {
  if (pendingRefresh != null) {
    return pendingRefresh;
  }

  const authState = getAuthStateNode();
  if (authState == null) {
    return null;
  }

  pendingRefresh = doRefreshToken(authState).finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
}
