"use client";

import { createContext } from "react";

import type { User } from "../types/internal";

/** Holds the user fetched on the server during the current request, so its roles and permissions are always up to date. */
export const CurrentUserContext = createContext<User | null>(null);
