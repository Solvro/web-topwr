"use client";

import { useContext } from "react";

import { CurrentUserContext } from "../context/current-user-context";
import type { User } from "../types/internal";
import { useAuthentication } from "./use-authentication";

/** Returns the currently logged in user. */
export function useCurrentUser(): User | null {
  const serverUser = useContext(CurrentUserContext);
  const { user } = useAuthentication();
  return serverUser ?? user;
}
