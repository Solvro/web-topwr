import { atom } from "jotai";

import type { AuthState } from "@/types/api";

import { globalStore } from "./global";

export const authStateAtom = atom<AuthState | null>(null);

/**
 * An atom accessor for use **outside** of React components.
 * @see {@link @/hooks/use-auth.ts#useAuth} for the React client hook version.
 * @see {@link @/lib/data-access.ts#getAuthState} for the React server component version.
 */
export const getAuthState = () => globalStore.get(authStateAtom);
