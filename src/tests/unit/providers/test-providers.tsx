"use client";

import { QueryClient } from "@tanstack/react-query";
import type { Store } from "jotai/vanilla/store";

import { InternalProviders } from "@/components/providers/internal-providers";
import { Toaster } from "@/components/ui/sonner";
import { CurrentUserProvider } from "@/features/authentication";
import { MOCK_SOLVRO_ADMIN } from "@/tests/shared";
import type { WrapperProps } from "@/types/components";

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
}: WrapperProps & {
  store: Store;
  renderToaster: boolean;
}) {
  return (
    <InternalProviders jotaiStore={store} queryClient={queryClient}>
      <CurrentUserProvider user={MOCK_SOLVRO_ADMIN}>
        {children}
        {renderToaster ? <Toaster /> : null}
      </CurrentUserProvider>
    </InternalProviders>
  );
}
