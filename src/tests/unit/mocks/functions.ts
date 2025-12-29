import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { vi } from "vitest";

export const MOCK_USE_ROUTER: AppRouterInstance = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
};

export const MOCK_USE_PATHNAME = vi.fn();

export const MOCK_USE_SEARCH_PARAMS = vi.fn(() => {
  const { ReadonlyURLSearchParams } =
    // Need to use 'require' because an async import would force the implementation to be a Promise
    // Cannot use top-level import because the mock is hoisted using vi.mock in setup.ts, and imports aren't available then
    // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports
    require("next/navigation") as typeof import("next/navigation");
  return new ReadonlyURLSearchParams();
});

export const MOCK_NOT_FOUND = vi.fn(() => null as never);

export const MOCK_INTERSECTION_OBSERVER = vi.fn();
MOCK_INTERSECTION_OBSERVER.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
