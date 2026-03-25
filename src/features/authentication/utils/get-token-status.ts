import { REFRESH_THRESHOLD_PERCENT } from "../constants";
import type { AuthState, TokenStatus } from "../types/internal";

function decodeJwtPayload(token: string): { iat?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const decoded = atob(parts[1].replaceAll("-", "+").replaceAll("_", "/"));
    return JSON.parse(decoded) as { iat?: number };
  } catch {
    return null;
  }
}

/**
 * Determines the validity status of the current access token.
 *
 * - `"both-expired"` – both access and refresh tokens are expired; user must re-login.
 * - `"expired"` – access token is expired but refresh token is still valid.
 * - `"expiring-soon"` – access token will expire within {@link REFRESH_THRESHOLD_PERCENT}% of its total lifetime.
 * - `"ok"` – access token is valid.
 */
export function getTokenStatus(authState: AuthState): TokenStatus {
  const now = Date.now();

  if (now >= authState.refreshTokenExpiresAt) {
    return "both-expired";
  }

  if (now >= authState.accessTokenExpiresAt) {
    return "expired";
  }

  const payload = decodeJwtPayload(authState.accessToken);
  if (payload?.iat != null) {
    const issuedAtMs = payload.iat * 1000;
    const totalLifetimeMs = authState.accessTokenExpiresAt - issuedAtMs;
    const remainingMs = authState.accessTokenExpiresAt - now;
    if (
      totalLifetimeMs > 0 &&
      remainingMs / totalLifetimeMs < REFRESH_THRESHOLD_PERCENT / 100
    ) {
      return "expiring-soon";
    }
  }

  return "ok";
}
