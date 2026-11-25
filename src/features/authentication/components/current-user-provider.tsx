"use client";

import type { WrapperProps } from "@/types/components";

import { CurrentUserContext } from "../context/current-user-context";
import type { User } from "../types/internal";

export function CurrentUserProvider({
  user,
  children,
}: WrapperProps & { user: User | null }) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}
