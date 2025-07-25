import { atom } from "jotai";

import type { AuthState } from "@/types/api";

import { globalStore } from "./global";

export const authStateAtom = atom<AuthState | null>(null);

/**
 * An atom accessor for use **outside** of React components.
 * @see {@link @/hooks/use-auth.useAuth} for the React hook version.
 */
export const getAuthState = () => globalStore.get(authStateAtom);
