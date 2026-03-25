import Cookies from "js-cookie";

import { env } from "@/config/env";
import { logger, parseError } from "@/features/logging";

import { AUTH_STATE_COOKIE_NAME } from "../constants";
import { AuthStateSchema } from "../schemas/auth-state-schema";
import type { AuthState } from "../types/internal";
import { getAuthStateNode } from "./get-auth-state.node";
import { getCookieOptions } from "./get-cookie-options";

interface RefreshResponse {
  newAccessToken: {
    accessToken: string;
    accessExpiresInMs: number;
  };
}

export async function doRefreshToken(
  authState: AuthState,
): Promise<AuthState | null> {
  try {
    const url = `${env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: authState.refreshToken }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, "Token refresh request failed");
      return null;
    }

    const { newAccessToken } = (await response.json()) as RefreshResponse;
    const now = Date.now();
    const currentState = getAuthStateNode();
    if (currentState == null) {
      return null;
    }

    const parsed = AuthStateSchema.safeParse({
      accessToken: newAccessToken.accessToken,
      accessTokenExpiresAt: now + newAccessToken.accessExpiresInMs,
      refreshToken: authState.refreshToken,
      refreshTokenExpiresAt: authState.refreshTokenExpiresAt,
      user: currentState.user,
    });

    if (!parsed.success) {
      logger.error(
        parsed.error.format(),
        "Token refresh response does not match expected schema",
      );
      return null;
    }

    const newState = parsed.data;
    Cookies.set(AUTH_STATE_COOKIE_NAME, ...getCookieOptions(newState));
    return newState;
  } catch (error) {
    logger.error(parseError(error), "Token refresh failed");
    return null;
  }
}
