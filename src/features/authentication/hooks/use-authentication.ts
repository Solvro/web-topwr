import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "sonner";

import { fetchMutation } from "@/lib/fetch-utils";
import type { LogInResponse, MessageResponse } from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { AUTH_STATE_COOKIE_NAME } from "../data/auth-state-cookie-name";
import { getCookieOptions } from "../lib/get-cookie-options";
import { getCurrentUser } from "../lib/get-current-user";
import { getUserDisplayName } from "../lib/get-user-display-name";
import { parseAuthCookie } from "../lib/parse-auth-cookie";
import { AuthStateSchema } from "../schemas/auth-state-schema";
import { authStateAtom } from "../stores/auth-state-atom";
import type { AuthState, User } from "../types";

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
  logout: () => Promise<void>;
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
export function useAuth(): AuthContext {
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

  /** Logs out by deleting the refresh token. Can only be called when logged in.
   *
   *  @param all if set to true, will invalidate all refresh tokens, causing logout on all devices.
   */
  async function logout(all = false) {
    if (authState == null) {
      throw new Error("Cannot log out when not authenticated");
    }
    const result = await fetchMutation<MessageResponse>(
      `auth/logout?all=${all ? "true" : "false"}`,
      {
        body: { refreshToken: authState.refreshToken },
      },
    );
    const expectedMessage = all
      ? "All refresh tokens marked as invalid"
      : "Invalidated the provided refresh token";
    if (result.message !== expectedMessage) {
      throw new Error(`Logout failed: ${result.message || "<no message>"}`);
    }
    toast.success(
      `Wylogowano pomyślnie${all ? " ze wszystkich urządzeń" : ""}.`,
    );
    Cookies.remove(AUTH_STATE_COOKIE_NAME);
    setAuthState(null);
  }

  return { ...parseAuthState(authState), login, logout };
}
