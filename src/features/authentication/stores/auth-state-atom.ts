import { atom } from "jotai";

import type { AuthState } from "../types/internal";

export const authStateAtom = atom<AuthState | null>(null);
