import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import Link from "next/link";
import ResizeObserver from "resize-observer-polyfill";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import "../shared/utils/env";
import { MockImage } from "./components/image";
import { server } from "./config/server";
import {
  MOCK_INTERSECTION_OBSERVER,
  MOCK_NOT_FOUND,
  MOCK_USE_PATHNAME,
  MOCK_USE_ROUTER,
  MOCK_USE_SEARCH_PARAMS,
} from "./mocks/functions";

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
    usePathname: MOCK_USE_PATHNAME,
    useSearchParams: MOCK_USE_SEARCH_PARAMS,
  } satisfies NextNavigationModule;
});
vi.mock("@solvro/next-view-transitions", () => ({
  useTransitionRouter: () => MOCK_USE_ROUTER,
  Link,
}));

vi.mock("next/image", () => ({ default: MockImage }));
vi.mock("@/lib/error-handling", { spy: true });
vi.mock("js-cookie");

globalThis.ResizeObserver = ResizeObserver as typeof globalThis.ResizeObserver;
globalThis.IntersectionObserver = MOCK_INTERSECTION_OBSERVER;

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
