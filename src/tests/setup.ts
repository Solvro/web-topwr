import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import ResizeObserver from "resize-observer-polyfill";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import {
  MOCK_NOT_FOUND,
  MOCK_USE_ROUTER,
  MOCK_USE_SEARCH_PARAMS,
} from "./mocks/functions";
import { MockImage } from "./mocks/image";
import { server } from "./mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
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
    useRouter: () => MOCK_USE_ROUTER,
    useSearchParams: MOCK_USE_SEARCH_PARAMS,
  } satisfies NextNavigationModule;
});

vi.mock("next/image", () => ({ default: MockImage }));
vi.mock("@/lib/error-handling", { spy: true });
vi.mock("js-cookie");

globalThis.ResizeObserver = ResizeObserver as typeof globalThis.ResizeObserver;

Element.prototype.scrollIntoView = vi.fn();
Document.prototype.elementFromPoint = vi.fn();
Element.prototype.hasPointerCapture = vi.fn(() => false);
Element.prototype.releasePointerCapture = vi.fn();

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
