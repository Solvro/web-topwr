"use client";

import { QueryClient } from "@tanstack/react-query";
import type { Store } from "jotai/vanilla/store";

import { Toaster } from "@/components/ui/sonner";
import type { LayoutProps } from "@/types/components";

import { InternalProviders } from "./internal-providers";

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
}: LayoutProps & {
  store: Store;
  renderToaster: boolean;
}) {
  return (
    <InternalProviders jotaiStore={store} queryClient={queryClient}>
      {children}
      {renderToaster ? <Toaster /> : null}
    </InternalProviders>
  );
}
