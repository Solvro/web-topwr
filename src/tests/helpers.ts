import { screen } from "@testing-library/dom";
import { expect } from "vitest";

export function getToaster() {
  const toaster = screen.getByRole("region", { name: "Notifications alt+T" });
  expect(toaster).toBeInTheDocument();
  return toaster;
}
