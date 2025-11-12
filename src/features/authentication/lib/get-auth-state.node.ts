import { globalStore } from "@/stores/global";

import { authStateAtom } from "../stores/auth-state-atom";

/**
 * An atom accessor for use **outside** of React components.
 * @see {@link ../hooks/use-authentication.ts} for the React client hook version.
 * @see {@link ./get-auth-state.server.ts} for the React server component version.
 */
export const getAuthStateNode = () => globalStore.get(authStateAtom);
