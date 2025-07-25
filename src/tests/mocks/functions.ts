import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { vi } from "vitest";

import type { Resource } from "@/config/enums";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";

export const MOCK_USE_ROUTER: AppRouterInstance = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
};

export const MOCK_USE_SEARCH_PARAMS = vi.fn(() => {
  const { ReadonlyURLSearchParams } =
    // Need to use 'require' because an async import would force the implementation to be a Promise
    // Cannot use top-level import because the mock is hoisted using vi.mock in setup.ts, and imports aren't available then
    // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports
    require("next/navigation") as typeof import("next/navigation");
  return new ReadonlyURLSearchParams();
});

export const MOCK_NOT_FOUND = vi.fn(() => null as never);

export const MOCK_API_RESOURCE_OPERATION = vi.fn(
  <T extends Resource>(
    details: { resource: T } & (
      | { operation: "read" | "delete"; body?: never }
      | { operation: "create"; body: ResourceFormValues<T> }
      | { operation: "update"; body: ResourceDataType<T> }
    ),
  ) => details,
);
