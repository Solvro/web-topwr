import { render } from "@testing-library/react";
import { createStore } from "jotai";
import type { ReactNode } from "react";

import { TestProviders } from "../providers/test-providers";
import type { RenderResultWithStore } from "../types/internal";

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
