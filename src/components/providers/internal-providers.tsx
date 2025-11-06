"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { Provider as StoreProvider } from "jotai";
import type { Store } from "jotai/vanilla/store";

import type { LayoutProps } from "@/types/components";

import { UnsavedChangesProvider } from "./unsaved-changes-provider";

export function InternalProviders({
  children,
  jotaiStore,
  queryClient,
}: LayoutProps & {
  jotaiStore: Store;
  queryClient: QueryClient;
}) {
  return (
    <StoreProvider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <UnsavedChangesProvider>{children}</UnsavedChangesProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}
