import { expect } from "vitest";

export function expectInputValue(
  inputElement: HTMLElement,
  value?: string | boolean | null,
) {
  if (typeof value === "boolean") {
    if (value) {
      expect(inputElement).toBeChecked();
    } else {
      expect(inputElement).not.toBeChecked();
    }
  } else {
    expect(inputElement).toHaveValue(value ?? "");
  }
}
