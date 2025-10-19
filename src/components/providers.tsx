"use client";

import { Provider } from "jotai";

import { QueryProvider } from "@/lib/query-client";
import { globalStore } from "@/stores/global";
import type { LayoutProps } from "@/types/app";

export function Providers({ children }: LayoutProps) {
  return (
    <Provider store={globalStore}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
}
