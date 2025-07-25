import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "sonner";

import { AUTH_STATE_COOKIE_NAME } from "@/config/constants";
import { getCookieOptions, parseAuthCookie } from "@/lib/cookies";
import { fetchMutation } from "@/lib/fetch-utils";
import { getUserDisplayName } from "@/lib/helpers";
import { authStateAtom } from "@/stores/auth";
import type {
  AuthState,
  MessageResponse,
  SuccessResponse,
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
        accessToken: state.token,
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
    const response = await fetchMutation<AuthState>("/auth/login", data);
    Cookies.set(AUTH_STATE_COOKIE_NAME, ...getCookieOptions(response));
    setAuthState(response);
    return response;
  }

  async function logout() {
    if (authState == null) {
      throw new Error("Cannot log out when not authenticated");
    }
    const result = await fetchMutation<SuccessResponse<MessageResponse>>(
      "/auth/logout",
      {},
    );
    if (!result.success) {
      throw new Error(result.message || "Logout failed");
    }
    toast.success("Wylogowano pomyślnie.");
    Cookies.remove(AUTH_STATE_COOKIE_NAME);
    setAuthState(null);
  }

  return { ...parseAuthState(authState), login, logout };
}
