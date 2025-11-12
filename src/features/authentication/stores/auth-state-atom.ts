import { atom } from "jotai";

import type { AuthState } from "../types";

export const authStateAtom = atom<AuthState | null>(null);
