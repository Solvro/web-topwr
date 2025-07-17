import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { createStore } from "jotai";
import type { ReactNode } from "react";
import { expect } from "vitest";

import { TestProviders } from "./test-providers";

interface RenderResultWithStore extends RenderResult {
  store: ReturnType<typeof createStore>;
}

export function getToaster() {
  const toaster = screen.getByRole("region", { name: "Notifications alt+T" });
  expect(toaster).toBeInTheDocument();
  return toaster;
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
