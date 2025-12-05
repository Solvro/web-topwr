"use client";

import { createContext } from "react";

import type { CalendarModalContextValue } from "../types/internal";

export const CalendarModalContext =
  createContext<CalendarModalContextValue | null>(null);
