import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "sonner";

import { AUTH_STATE_COOKIE_NAME } from "@/config/constants";
import { getCookieOptions, parseAuthCookie } from "@/lib/cookies";
import { fetchMutation } from "@/lib/fetch-utils";
import { getCurrentUser, getUserDisplayName } from "@/lib/helpers";
import { authStateAtom } from "@/stores/auth";
import type {
  AuthState,
  LogInResponse,
  MessageResponse,
  User,
} from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

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
    const { accessToken, refreshToken } = await fetchMutation<LogInResponse>(
      "auth/login",
      {
        body: data,
      },
    );
    const newState: AuthState = {
      accessToken,
      refreshToken,
      user: await getCurrentUser(accessToken),
    };
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
