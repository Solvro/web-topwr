import type { useRouter } from "next/navigation";
import { vi } from "vitest";

export const MOCK_ROUTER: ReturnType<typeof useRouter> = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

export const MOCK_NOT_FOUND = vi.fn(() => null as never);
