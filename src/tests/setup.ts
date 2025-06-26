import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import ResizeObserver from "resize-observer-polyfill";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import {
  MOCK_NOT_FOUND,
  MOCK_ROUTER_BACK,
  MOCK_ROUTER_FORWARD,
  MOCK_ROUTER_PREFETCH,
  MOCK_ROUTER_PUSH,
  MOCK_ROUTER_REFRESH,
  MOCK_ROUTER_REPLACE,
} from "./mocks/functions";
import { MockImage } from "./mocks/image";
import { server } from "./mocks/server";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  cleanup();
});
afterAll(() => {
  server.close();
});

type NextNavigationModule = typeof import("next/navigation");
vi.mock("next/navigation", async (importOriginal) => {
  const original = await importOriginal<NextNavigationModule>();
  return {
    ...original,
    notFound: MOCK_NOT_FOUND,
    useRouter: () => ({
      push: MOCK_ROUTER_PUSH,
      replace: MOCK_ROUTER_REPLACE,
      refresh: MOCK_ROUTER_REFRESH,
      prefetch: MOCK_ROUTER_PREFETCH,
      back: MOCK_ROUTER_BACK,
      forward: MOCK_ROUTER_FORWARD,
    }),
  } satisfies NextNavigationModule;
});

vi.mock("next/image", () => ({ default: MockImage }));
vi.mock("@/lib/error-handling", { spy: true });
vi.mock("js-cookie");

globalThis.ResizeObserver = ResizeObserver as typeof globalThis.ResizeObserver;

Element.prototype.scrollIntoView = vi.fn();
Document.prototype.elementFromPoint = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
