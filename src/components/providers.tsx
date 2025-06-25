"use client";

import { Provider } from "jotai";
import type { ReactNode } from "react";

import { QueryProvider } from "@/lib/query-client";
import { globalStore } from "@/stores/global";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={globalStore}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
}
