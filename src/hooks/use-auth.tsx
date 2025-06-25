import { useAtom } from "jotai";
import { toast } from "sonner";

import { fetchMutation } from "@/lib/fetch-utils";
import type {
  AuthState,
  MessageResponse,
  SuccessResponse,
  User,
} from "@/lib/types";
import { authStateAtom } from "@/stores/auth";

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
  login: (email: string, password: string) => Promise<void>;
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

  const commonState = parseAuthState(authState);

  async function login(email: string, password: string, rememberMe = false) {
    if (commonState.isAuthenticated) {
      throw new Error("Cannot log in when already authenticated");
    }

    const response = await fetchMutation<AuthState>("/auth/login", {
      email,
      password,
      rememberMe,
    });

    setAuthState(response);
    toast.success(
      `Pomyślnie zalogowano jako ${response.user.fullName ?? response.user.email}!`,
    );
  }

  async function logout() {
    if (!commonState.isAuthenticated) {
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
  }

  return { ...commonState, login, logout };
}
