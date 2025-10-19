"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { LayoutProps } from "@/types/app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

export function QueryProvider({ children }: LayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
