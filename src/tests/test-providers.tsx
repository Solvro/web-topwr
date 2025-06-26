"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import type { ComponentProps, ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

interface RenderResultWithStore extends RenderResult {
  store: ReturnType<typeof createStore>;
}

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

function TestProviders({
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

export function renderWithProviders(
  component: ReactNode,
  renderToaster = true,
): RenderResultWithStore {
  const store = createStore();
  return {
    store,
    ...render(
      <TestProviders store={store} renderToaster={renderToaster}>
        {component}
      </TestProviders>,
    ),
  };
}
