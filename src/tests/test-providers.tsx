"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import type { ComponentProps } from "react";

import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function TestProviders({
  children,
  store,
  renderToaster,
}: ComponentProps<typeof Provider> & { renderToaster: boolean }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {renderToaster ? <Toaster /> : null}
      </QueryClientProvider>
    </Provider>
  );
}
