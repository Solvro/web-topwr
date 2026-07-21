"use client";
import { ViewTransitions } from "@solvro/next-view-transitions";
import { QueryClient, environmentManager } from "@tanstack/react-query";

import { globalStore } from "@/stores/global";
import type { WrapperProps } from "@/types/components";

import { InternalProviders } from "./internal-providers";

// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}

export function RootProviders({ children }: WrapperProps) {
  const queryClient = getQueryClient();

  return (
    <ViewTransitions>
      <InternalProviders queryClient={queryClient} jotaiStore={globalStore}>
        {children}
      </InternalProviders>
    </ViewTransitions>
  );
}
