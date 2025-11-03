"use client";

import { Provider as StoreProvider } from "jotai";

import { QueryProvider } from "@/lib/query-client";
import { globalStore } from "@/stores/global";
import type { LayoutProps } from "@/types/components";

export function RootProviders({ children }: LayoutProps) {
  return (
    <StoreProvider store={globalStore}>
      <QueryProvider>{children}</QueryProvider>
    </StoreProvider>
  );
}
