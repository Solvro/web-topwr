import { screen } from "@testing-library/react";
import { expect } from "vitest";

export function getToaster() {
  const toaster = screen.getByRole("region", { name: "Notifications alt+T" });
  expect(toaster).toBeInTheDocument();
  return toaster;
}
