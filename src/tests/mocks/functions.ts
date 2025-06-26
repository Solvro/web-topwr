import { vi } from "vitest";

export const MOCK_ROUTER_PUSH = vi.fn();
export const MOCK_ROUTER_REPLACE = vi.fn();
export const MOCK_ROUTER_REFRESH = vi.fn();
export const MOCK_ROUTER_PREFETCH = vi.fn();
export const MOCK_ROUTER_BACK = vi.fn();
export const MOCK_ROUTER_FORWARD = vi.fn();

export const MOCK_NOT_FOUND = vi.fn(() => null as never);
