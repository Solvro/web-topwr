import { vi } from "vitest";

export const MOCK_USE_SEARCH_PARAMS = vi.fn(() => {
  const { ReadonlyURLSearchParams } =
    // Need to use 'require' because an async import would force the implementation to be a Promise
    // Cannot use top-level import because the mock is hoisted using vi.mock in setup.ts, and imports aren't available then
    // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports
    require("next/navigation") as typeof import("next/navigation");
  return new ReadonlyURLSearchParams();
});
