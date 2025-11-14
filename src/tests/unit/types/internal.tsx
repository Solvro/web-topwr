import type { RenderResult } from "@testing-library/react";
import type { createStore } from "jotai";

export interface RenderResultWithStore extends RenderResult {
  store: ReturnType<typeof createStore>;
}
