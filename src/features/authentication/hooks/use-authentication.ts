"use client";

import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "sonner";

import { fetchMutation } from "@/features/backend";
import type { LogInResponse, MessageResponse } from "@/features/backend/types";

import { getCurrentUser } from "../api/get-current-user";
import { AUTH_STATE_COOKIE_NAME } from "../constants";
import { AuthStateSchema } from "../schemas/auth-state-schema";
import { authStateAtom } from "../stores/auth-state-atom";
import type { AuthState, LoginFormValues, User } from "../types/internal";
import { getCookieOptions } from "../utils/get-cookie-options";
import { getUserDisplayName } from "../utils/get-user-display-name";
import { parseAuthCookie } from "../utils/parse-auth-cookie";

interface AuthContextLoggedIn {
  isAuthenticated: true;
  user: User;
  accessToken: string;
}

interface AuthContextLoggedOut {
  isAuthenticated: false;
  user: null;
  accessToken: null;
}

type AuthContext = (AuthContextLoggedIn | AuthContextLoggedOut) & {
  login: (data: LoginFormValues) => Promise<AuthState>;
  logout: (all?: boolean) => Promise<void>;
  logoutRequest: (all?: boolean) => Promise<void>;
  clearAuthState: () => void;
};

const parseAuthState = (
  state: AuthState | null,
): AuthContextLoggedIn | AuthContextLoggedOut =>
  state == null
    ? {
        isAuthenticated: false,
        user: null,
        accessToken: null,
      }
    : {
        isAuthenticated: true,
        user: state.user,
        accessToken: state.accessToken,
      };

/** React hook for client-side authentication-related operations. */
export function useAuthentication(): AuthContext {
  const [authState, setAuthState] = useAtom(authStateAtom);

  useEffect(() => {
    if (authState != null) {
      return;
    }
    const cookie = Cookies.get(AUTH_STATE_COOKIE_NAME);
    if (cookie == null) {
      return;
    }
    const parsed = parseAuthCookie(cookie);
    if (parsed == null) {
      Cookies.remove(AUTH_STATE_COOKIE_NAME);
    } else {
      setAuthState(parsed);
    }
  }, [authState, setAuthState]);

  async function login(data: LoginFormValues) {
    if (authState != null) {
      throw new Error(
        `Cannot log in: already authenticated as ${getUserDisplayName(authState.user)}`,
      );
    }
    const now = Date.now();
    const { accessToken, refreshToken, accessExpiresInMs, refreshExpiresInMs } =
      await fetchMutation<LogInResponse>("auth/login", {
        body: data,
      });
    const user: User = await getCurrentUser(accessToken);
    const newState = AuthStateSchema.parse({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: now + accessExpiresInMs,
      refreshTokenExpiresAt: now + refreshExpiresInMs,
      user,
    });
    Cookies.set(AUTH_STATE_COOKIE_NAME, ...getCookieOptions(newState));
    setAuthState(newState);
    return newState;
  }

  /**
   * Makes logout API request to invalidate refresh token on server.
   * Does NOT clear local state - call clearAuthState() separately.
   * @param all if set to true, will invalidate all refresh tokens
   * @throws Error if request fails or response is invalid
   */
  async function logoutRequest(all = false): Promise<void> {
    if (authState == null) {
      throw new Error("Cannot log out when not authenticated");
    }
    const result = await fetchMutation<MessageResponse>(
      `auth/logout?all=${String(all)}`,
      {
        body: { refreshToken: authState.refreshToken },
      },
    );
    const expectedMessage = all
      ? "All refresh tokens marked as invalid"
      : "Invalidated the provided refresh token";
    if (result.message !== expectedMessage) {
      throw new Error(
        `Logout failed: ${result.message || "<missing-result-message>"}`,
      );
    }
  }

  /**
   * Clears local authentication state (cookies and atom).
   * Should be called AFTER successful logoutRequest().
   */
  function clearAuthState(): void {
    Cookies.remove(AUTH_STATE_COOKIE_NAME);
    setAuthState(null);
  }

  /**
   * Complete logout flow: makes API request and clears state.
   * For backward compatibility with existing code that calls logout() directly.
   * @param all if set to true, will invalidate all refresh tokens
   */
  async function logout(all = false): Promise<void> {
    await logoutRequest(all);
    toast.success(
      `Wylogowano pomyślnie${all ? " ze wszystkich urządzeń" : ""}.`,
    );
    clearAuthState();
  }

  return {
    ...parseAuthState(authState),
    login,
    logout,
    logoutRequest,
    clearAuthState,
  };
}
