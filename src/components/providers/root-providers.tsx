"use client";

import { ViewTransitions } from "@solvro/next-view-transitions";
import { QueryClient } from "@tanstack/react-query";

import { globalStore } from "@/stores/global";
import type { LayoutProps } from "@/types/components";

import { InternalProviders } from "./internal-providers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

export function RootProviders({ children }: LayoutProps) {
  return (
    <ViewTransitions>
      <InternalProviders queryClient={queryClient} jotaiStore={globalStore}>
        {children}
      </InternalProviders>
    </ViewTransitions>
  );
}
