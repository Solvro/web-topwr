import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./mocks/server";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

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
